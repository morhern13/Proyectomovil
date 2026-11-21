<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::with('children')
            ->where('company_id', $request->user()->company_id)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'color' => 'nullable|string|max:7',
        ]);

        $category = Category::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'color' => $request->color,
            'slug' => str($request->name)->slug(),
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        if ($category->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $category->update($request->only(['name', 'parent_id', 'color', 'is_active', 'sort_order']));

        return response()->json($category);
    }

    public function destroy(Category $category, Request $request): JsonResponse
    {
        if ($category->company_id !== $request->user()->company_id) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        if ($category->products()->count() > 0) {
            return response()->json(['message' => 'Categoría tiene productos asociados.'], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Categoría eliminada.']);
    }
}
