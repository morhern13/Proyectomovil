<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand', 'supplier'])
            ->where('company_id', $request->user()->company_id);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('code', 'ilike', "%{$request->search}%")
                  ->orWhere('barcode', 'ilike', "%{$request->search}%");
            });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->brand_id) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->low_stock) {
            $query->where('stock', '<=', DB::raw('stock_min'));
        }

        $products = $query->orderBy('name')->paginate($request->per_page ?? 25);

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:products,code',
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'cost' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|numeric|min:0',
            'stock_min' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string|max:100|unique:products,barcode',
        ]);

        $data = $request->all();
        $data['company_id'] = $request->user()->company_id;

        $product = Product::create($data);

        return response()->json($product->load(['category', 'brand']), 201);
    }

    public function show(Product $product, Request $request): JsonResponse
    {
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        return response()->json($product->load(['category', 'brand', 'supplier', 'variants', 'prices']));
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'code' => 'required|string|max:50|unique:products,code,' . $product->id,
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'price' => 'nullable|numeric|min:0',
            'stock_min' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string|max:100|unique:products,barcode,' . $product->id,
        ]);

        $product->update($request->all());

        return response()->json($product->load(['category', 'brand']));
    }

    public function destroy(Product $product, Request $request): JsonResponse
    {
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        if ($product->stock > 0) {
            return response()->json(['message' => 'No se puede eliminar un producto con stock.'], 422);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado.']);
    }

    public function kardex(Product $product, Request $request): JsonResponse
    {
        if ($product->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $movements = $product->movements()
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 50);

        return response()->json([
            'product' => $product->only(['id', 'name', 'code', 'stock']),
            'movements' => $movements,
        ]);
    }
}
