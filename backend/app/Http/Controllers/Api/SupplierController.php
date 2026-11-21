<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::where('company_id', $request->user()->company_id);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")->orWhere('code', 'ilike', "%{$request->search}%");
            });
        }
        return response()->json($query->orderBy('name')->paginate($request->per_page ?? 25));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:suppliers,code',
            'name' => 'required|string|max:255',
        ]);
        $data = $request->all();
        $data['company_id'] = $request->user()->company_id;
        return response()->json(Supplier::create($data), 201);
    }

    public function update(Request $request, Supplier $supplier): JsonResponse
    {
        if ($supplier->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }
        $supplier->update($request->all());
        return response()->json($supplier);
    }

    public function destroy(Supplier $supplier, Request $request): JsonResponse
    {
        if ($supplier->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }
        $supplier->delete();
        return response()->json(['message' => 'Proveedor eliminado.']);
    }
}
