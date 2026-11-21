<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = 1;
        $userId = 1;
        $now = now();

        // Invoice 1 - Cash sale to Juan Pérez
        $inv1 = DB::transaction(function () use ($companyId, $userId, $now) {
            $inv = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => 1,
                'user_id' => $userId,
                'type' => 'factura',
                'number' => 'FAC-0001',
                'status' => 'paid',
                'date' => $now->copy()->subDays(5),
                'payment_method' => 'efectivo',
                'seller' => 'María Vendedora',
                'subtotal' => 8790,
                'discount' => 0,
                'tax' => 1582.20,
                'total' => 10372.20,
                'paid' => 10372.20,
                'balance' => 0,
                'notes' => 'Venta de mostrador',
            ]);

            // Item 1: Nike Air Max 90 x 1
            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 1,
                'line_number' => 1,
                'description' => 'Nike Air Max 90',
                'quantity' => 1,
                'unit_price' => 5495,
                'cost' => 3200,
                'subtotal' => 5495,
                'tax_percent' => 18,
                'tax_amount' => 989.10,
                'total' => 6484.10,
            ]);
            $this->logMovement($companyId, 1, $userId, $inv->id, $inv->number, 1, 5495, 25, 24);

            // Item 2: Medias Nike 3 Pares x 2
            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 28,
                'line_number' => 2,
                'description' => 'Medias Nike 3 Pares',
                'quantity' => 2,
                'unit_price' => 695,
                'cost' => 350,
                'subtotal' => 1390,
                'tax_percent' => 18,
                'tax_amount' => 250.20,
                'total' => 1640.20,
            ]);
            $this->logMovement($companyId, 28, $userId, $inv->id, $inv->number, 2, 350, 60, 58);

            // Item 3: Gorra Nike Dri-FIT x 1
            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 26,
                'line_number' => 3,
                'description' => 'Gorra Nike Dri-FIT',
                'quantity' => 1,
                'unit_price' => 995,
                'cost' => 500,
                'subtotal' => 995,
                'tax_percent' => 18,
                'tax_amount' => 179.10,
                'total' => 1174.10,
            ]);
            $this->logMovement($companyId, 26, $userId, $inv->id, $inv->number, 1, 500, 35, 34);

            // Item 4: Cinturón Tommy Hilfiger x 1
            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 24,
                'line_number' => 4,
                'description' => 'Cinturón Tommy Hilfiger',
                'quantity' => 1,
                'unit_price' => 1995,
                'cost' => 1000,
                'subtotal' => 1995,
                'tax_percent' => 18,
                'tax_amount' => 359.10,
                'total' => 2354.10,
            ]);
            $this->logMovement($companyId, 24, $userId, $inv->id, $inv->number, 1, 1000, 20, 19);

            // Also update product stock
            Product::where('id', 1)->decrement('stock', 1);
            Product::where('id', 28)->decrement('stock', 2);
            Product::where('id', 26)->decrement('stock', 1);
            Product::where('id', 24)->decrement('stock', 1);

            return $inv;
        });

        // Invoice 2 - Credit sale to María Rodríguez
        $inv2 = DB::transaction(function () use ($companyId, $userId, $now) {
            $inv = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => 2,
                'user_id' => $userId,
                'type' => 'factura',
                'number' => 'FAC-0002',
                'status' => 'pending',
                'date' => $now->copy()->subDays(3),
                'due_date' => $now->copy()->addDays(27),
                'payment_method' => 'credito',
                'seller' => 'Admin Principal',
                'subtotal' => 5495,
                'discount' => 274.75,
                'tax' => 939.65,
                'total' => 6159.90,
                'paid' => 0,
                'balance' => 6159.90,
                'notes' => 'Venta a crédito',
            ]);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 6,
                'line_number' => 1,
                'description' => 'New Balance 574',
                'quantity' => 1,
                'unit_price' => 4995,
                'discount_percent' => 5,
                'discount_amount' => 249.75,
                'cost' => 2900,
                'subtotal' => 4745.25,
                'tax_percent' => 18,
                'tax_amount' => 854.15,
                'total' => 5599.40,
            ]);
            $this->logMovement($companyId, 6, $userId, $inv->id, $inv->number, 1, 2900, 12, 11);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 27,
                'line_number' => 2,
                'description' => 'Medias Adidas 3 Pares',
                'quantity' => 1,
                'unit_price' => 595,
                'discount_percent' => 5,
                'discount_amount' => 29.75,
                'cost' => 300,
                'subtotal' => 565.25,
                'tax_percent' => 18,
                'tax_amount' => 101.75,
                'total' => 667.00,
            ]);
            $this->logMovement($companyId, 27, $userId, $inv->id, $inv->number, 1, 300, 55, 54);

            // Also update product stock
            Product::where('id', 6)->decrement('stock', 1);
            Product::where('id', 27)->decrement('stock', 1);

            // Add partial payment
            $inv->payments()->create([
                'company_id' => $companyId,
                'date' => $now->copy()->subDays(3),
                'amount' => 0,
                'payment_method' => 'credito',
                'notes' => 'Pendiente de pago',
            ]);

            return $inv;
        });

        // Invoice 3 - Cash sale to Ana Martínez
        $inv3 = DB::transaction(function () use ($companyId, $userId, $now) {
            $inv = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => 4,
                'user_id' => $userId,
                'type' => 'factura',
                'number' => 'FAC-0003',
                'status' => 'paid',
                'date' => $now->copy()->subDays(1),
                'payment_method' => 'tarjeta',
                'seller' => 'María Vendedora',
                'subtotal' => 4595,
                'discount' => 0,
                'tax' => 827.10,
                'total' => 5422.10,
                'paid' => 5422.10,
                'balance' => 0,
                'notes' => 'Pago con tarjeta',
            ]);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 2,
                'line_number' => 1,
                'description' => 'Nike Revolution 7',
                'quantity' => 1,
                'unit_price' => 4595,
                'cost' => 2800,
                'subtotal' => 4595,
                'tax_percent' => 18,
                'tax_amount' => 827.10,
                'total' => 5422.10,
            ]);
            $this->logMovement($companyId, 2, $userId, $inv->id, $inv->number, 1, 2800, 40, 39);

            Product::where('id', 2)->decrement('stock', 1);

            return $inv;
        });

        // Invoice 4 - Corporate sale to Jiménez Comercial
        $inv4 = DB::transaction(function () use ($companyId, $userId, $now) {
            $inv = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => 3,
                'user_id' => $userId,
                'type' => 'factura',
                'number' => 'FAC-0004',
                'status' => 'pending',
                'date' => $now->copy()->subDays(2),
                'due_date' => $now->copy()->addDays(58),
                'payment_method' => 'credito',
                'seller' => 'Admin Principal',
                'subtotal' => 12980,
                'discount' => 1298,
                'tax' => 2102.76,
                'total' => 13784.76,
                'paid' => 0,
                'balance' => 13784.76,
                'notes' => 'Venta corporativa mayorista',
            ]);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 3,
                'line_number' => 1,
                'description' => 'Adidas Runfalcon 5 x 2 pares',
                'quantity' => 2,
                'unit_price' => 4295,
                'discount_percent' => 10,
                'discount_amount' => 859,
                'cost' => 2500,
                'subtotal' => 7731,
                'tax_percent' => 18,
                'tax_amount' => 1391.58,
                'total' => 9122.58,
            ]);
            $this->logMovement($companyId, 3, $userId, $inv->id, $inv->number, 2, 2500, 18, 16);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 11,
                'line_number' => 2,
                'description' => 'Camiseta Nike Dri-FIT x 3',
                'quantity' => 3,
                'unit_price' => 1495,
                'discount_percent' => 10,
                'discount_amount' => 448.50,
                'cost' => 800,
                'subtotal' => 4036.50,
                'tax_percent' => 18,
                'tax_amount' => 726.57,
                'total' => 4763.07,
            ]);
            $this->logMovement($companyId, 11, $userId, $inv->id, $inv->number, 3, 800, 50, 47);

            Product::where('id', 3)->decrement('stock', 2);
            Product::where('id', 11)->decrement('stock', 3);

            return $inv;
        });

        // Invoice 5 - Cash walk-in customer (no customer_id)
        $inv5 = DB::transaction(function () use ($companyId, $userId, $now) {
            $inv = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => null,
                'user_id' => $userId,
                'type' => 'factura',
                'number' => 'FAC-0005',
                'status' => 'paid',
                'date' => $now->copy(),
                'payment_method' => 'efectivo',
                'seller' => 'María Vendedora',
                'subtotal' => 4495,
                'discount' => 0,
                'tax' => 809.10,
                'total' => 5304.10,
                'paid' => 5304.10,
                'balance' => 0,
                'notes' => 'Consumidor final',
            ]);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 10,
                'line_number' => 1,
                'description' => 'Botas Reebok Classic',
                'quantity' => 1,
                'unit_price' => 4495,
                'cost' => 2600,
                'subtotal' => 4495,
                'tax_percent' => 18,
                'tax_amount' => 809.10,
                'total' => 5304.10,
            ]);
            $this->logMovement($companyId, 10, $userId, $inv->id, $inv->number, 1, 2600, 10, 9);

            Product::where('id', 10)->decrement('stock', 1);

            return $inv;
        });

        // Invoice 6 - Cash sale to Laura Castillo
        $inv6 = DB::transaction(function () use ($companyId, $userId, $now) {
            $inv = Invoice::create([
                'company_id' => $companyId,
                'customer_id' => 6,
                'user_id' => $userId,
                'type' => 'factura',
                'number' => 'FAC-0006',
                'status' => 'paid',
                'date' => $now->copy()->subDays(7),
                'payment_method' => 'efectivo',
                'seller' => 'Admin Principal',
                'subtotal' => 3795,
                'discount' => 0,
                'tax' => 683.10,
                'total' => 4478.10,
                'paid' => 4478.10,
                'balance' => 0,
            ]);

            $inv->items()->create([
                'company_id' => $companyId,
                'product_id' => 4,
                'line_number' => 1,
                'description' => 'Puma Smash v3',
                'quantity' => 1,
                'unit_price' => 3795,
                'cost' => 2100,
                'subtotal' => 3795,
                'tax_percent' => 18,
                'tax_amount' => 683.10,
                'total' => 4478.10,
            ]);
            $this->logMovement($companyId, 4, $userId, $inv->id, $inv->number, 1, 2100, 30, 29);

            Product::where('id', 4)->decrement('stock', 1);

            return $inv;
        });
    }

    private function logMovement($companyId, $productId, $userId, $invoiceId, $invoiceNumber, $quantity, $unitCost, $stockBefore, $stockAfter): void
    {
        InventoryMovement::create([
            'company_id' => $companyId,
            'product_id' => $productId,
            'user_id' => $userId,
            'type' => 'sale',
            'reference_type' => 'invoice',
            'reference_id' => $invoiceId,
            'reference_number' => $invoiceNumber,
            'quantity' => -$quantity,
            'stock_before' => $stockBefore,
            'stock_after' => $stockAfter,
            'unit_cost' => $unitCost,
            'notes' => "Venta #$invoiceNumber",
        ]);
    }
}
