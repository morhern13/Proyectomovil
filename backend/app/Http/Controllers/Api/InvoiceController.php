<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with('customer')
            ->where('company_id', $request->user()->company_id);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('number', 'ilike', "%{$request->search}%")
                  ->orWhereHas('customer', fn($c) => $c->where('name', 'ilike', "%{$request->search}%"));
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->date_from) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('date', '<=', $request->date_to);
        }

        return response()->json($query->orderBy('date', 'desc')->paginate($request->per_page ?? 25));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:factura,recibo,ticket,devolucion',
            'customer_id' => 'nullable|exists:customers,id',
            'date' => 'required|date',
            'payment_method' => 'nullable|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $companyId = $request->user()->company_id;

        return DB::transaction(function () use ($request, $companyId) {
            $number = Invoice::where('company_id', $companyId)
                ->where('type', $request->type)
                ->max('number') ?? 0;
            $number = str_pad((int)$number + 1, 8, '0', STR_PAD_LEFT);

            $subtotal = 0;
            $items = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $total = $item['quantity'] * $item['unit_price'];
                $subtotal += $total;

                $items[] = [
                    'company_id' => $companyId,
                    'product_id' => $product->id,
                    'description' => $product->name,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'cost' => $product->cost,
                    'subtotal' => $total,
                    'total' => $total,
                ];
            }

            $invoice = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => $request->customer_id,
                'user_id' => $request->user()->id,
                'type' => $request->type,
                'number' => $number,
                'status' => 'pendiente',
                'date' => $request->date,
                'payment_method' => $request->payment_method,
                'seller' => $request->user()->name,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'balance' => $subtotal,
                'notes' => $request->notes,
            ]);

            foreach ($items as $item) {
                $item['invoice_id'] = $invoice->id;
                $item['company_id'] = $companyId;
                $invoice->items()->create($item);

                // Update stock
                $product = Product::find($item['product_id']);
                if ($product && $product->track_stock) {
                    $before = $product->stock;
                    $product->decrement('stock', $item['quantity']);

                    InventoryMovement::create([
                        'company_id' => $companyId,
                        'product_id' => $product->id,
                        'user_id' => $request->user()->id,
                        'type' => 'salida',
                        'reference_type' => 'invoice',
                        'reference_id' => $invoice->id,
                        'reference_number' => $number,
                        'quantity' => -$item['quantity'],
                        'stock_before' => $before,
                        'stock_after' => $before - $item['quantity'],
                        'unit_cost' => $product->cost,
                    ]);
                }
            }

            return response()->json($invoice->load(['customer', 'items']), 201);
        });
    }

    public function show(Invoice $invoice, Request $request): JsonResponse
    {
        if ($invoice->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        return response()->json($invoice->load(['customer', 'items.product', 'payments']));
    }

    public function destroy(Invoice $invoice, Request $request): JsonResponse
    {
        if ($invoice->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        DB::transaction(function () use ($invoice) {
            foreach ($invoice->items as $item) {
                $product = $item->product;
                if ($product && $product->track_stock) {
                    $product->increment('stock', $item->quantity);
                }
            }
            $invoice->items()->delete();
            $invoice->delete();
        });

        return response()->json(['message' => 'Factura eliminada y stock restaurado.']);
    }
}
