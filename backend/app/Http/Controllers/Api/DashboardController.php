<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $companyId = $request->user()->company_id;

        $productsCount = Product::where('company_id', $companyId)->count();
        $lowStockCount = Product::where('company_id', $companyId)
            ->where('track_stock', true)
            ->whereColumn('stock', '<=', 'stock_min')
            ->count();
        $customersCount = Customer::where('company_id', $companyId)->count();

        $monthSales = Invoice::where('company_id', $companyId)
            ->where('status', '!=', 'anulada')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('total');

        $pendingInvoices = Invoice::where('company_id', $companyId)
            ->where('status', 'pendiente')
            ->count();

        return response()->json([
            'products_count' => $productsCount,
            'low_stock_count' => $lowStockCount,
            'customers_count' => $customersCount,
            'month_sales' => $monthSales,
            'pending_invoices' => $pendingInvoices,
        ]);
    }
}
