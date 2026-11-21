<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Customer::where('company_id', $request->user()->company_id);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('code', 'ilike', "%{$request->search}%")
                  ->orWhere('tax_id', 'ilike', "%{$request->search}%");
            });
        }

        return response()->json($query->orderBy('name')->paginate($request->per_page ?? 25));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:customers,code',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'tax_id' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:30',
        ]);

        $data = $request->all();
        $data['company_id'] = $request->user()->company_id;

        return response()->json(Customer::create($data), 201);
    }

    public function show(Customer $customer, Request $request): JsonResponse
    {
        if ($customer->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        return response()->json($customer->load('invoices'));
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        if ($customer->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $customer->update($request->all());

        return response()->json($customer);
    }

    public function destroy(Customer $customer, Request $request): JsonResponse
    {
        if ($customer->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $customer->delete();

        return response()->json(['message' => 'Cliente eliminado.']);
    }
}
