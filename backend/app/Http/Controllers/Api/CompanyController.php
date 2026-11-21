<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(Company::where('is_active', true)->get());
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        if ($company->id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $company->update($request->all());

        return response()->json($company);
    }
}
