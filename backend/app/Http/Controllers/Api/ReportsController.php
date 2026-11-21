<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function sales(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;
        $from = $request->get('from', now()->startOfMonth()->toDateString());
        $to = $request->get('to', now()->toDateString());
        $groupBy = $request->get('group_by', 'day');

        $invoices = Invoice::where('company_id', $companyId)
            ->where('status', '!=', 'anulada')
            ->whereBetween('date', [$from, $to]);

        $totals = (clone $invoices)->selectRaw('
            COUNT(*) as total_invoices,
            COALESCE(SUM(total), 0) as total_revenue,
            COALESCE(SUM(tax), 0) as total_tax,
            COALESCE(SUM(subtotal), 0) as total_subtotal
        ')->first();

        $byPayment = (clone $invoices)
            ->selectRaw('payment_method, COUNT(*) as count, COALESCE(SUM(total), 0) as total')
            ->groupBy('payment_method')
            ->get();

        $topProducts = InvoiceItem::whereIn('invoice_id', (clone $invoices)->pluck('id'))
            ->selectRaw('product_id, SUM(quantity) as total_qty, COALESCE(SUM(subtotal), 0) as total')
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->with('product:id,name,code')
            ->get();

        $salesByPeriod = (clone $invoices)
            ->selectRaw("
                TO_CHAR(date, 'YYYY-MM-DD') as period,
                COUNT(*) as count,
                COALESCE(SUM(total), 0) as total
            ")
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'totals' => $totals,
            'by_payment' => $byPayment,
            'top_products' => $topProducts,
            'sales_by_period' => $salesByPeriod,
        ]);
    }

    public function inventory(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;

        $products = Product::where('company_id', $companyId)
            ->with('category:id,name')
            ->orderBy('name')
            ->get();

        $totalValue = $products->sum(fn($p) => $p->stock * $p->cost);
        $totalSaleValue = $products->sum(fn($p) => $p->stock * $p->price);
        $totalItems = $products->sum('stock');
        $totalProducts = $products->count();

        $lowStock = $products->filter(fn($p) => $p->track_stock && $p->stock <= $p->stock_min)->values();

        $byCategory = $products->groupBy(fn($p) => $p->category?->name ?? 'Sin categoría')
            ->map(fn($items, $cat) => [
                'category' => $cat,
                'count' => $items->count(),
                'stock' => $items->sum('stock'),
                'value' => $items->sum(fn($p) => $p->stock * $p->cost),
            ])->values();

        return response()->json([
            'summary' => [
                'total_products' => $totalProducts,
                'total_stock_items' => $totalItems,
                'total_inventory_value' => $totalValue,
                'total_sale_value' => $totalSaleValue,
                'low_stock_count' => $lowStock->count(),
            ],
            'low_stock' => $lowStock,
            'by_category' => $byCategory,
        ]);
    }
}
