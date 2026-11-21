<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            ['code' => 'PROV-001', 'name' => 'Calzado Import RD', 'business_name' => 'Calzado Import RD SRL', 'tax_id' => '131-1111111-1', 'email' => 'ventas@calzadoimport.com', 'phone' => '809-100-1000', 'contact_person' => 'Luis Fernández', 'address' => 'Zona Industrial de Herrera', 'city' => 'Santo Domingo', 'credit_limit' => 200000, 'balance' => 45000, 'discount_percent' => 5, 'payment_terms' => '30-dias', 'category' => 'calzado', 'notes' => 'Importador de calzado deportivo'],
            ['code' => 'PROV-002', 'name' => 'Textilera del Caribe', 'business_name' => 'Textilera del Caribe SA', 'tax_id' => '131-2222222-2', 'email' => 'info@textileracaribe.com', 'phone' => '809-200-2000', 'contact_person' => 'Martha Reyes', 'address' => 'Av. John F. Kennedy Km 5', 'city' => 'Santo Domingo', 'credit_limit' => 300000, 'balance' => 89000, 'discount_percent' => 8, 'payment_terms' => '45-dias', 'category' => 'ropa', 'notes' => 'Fabricante textil mayorista'],
            ['code' => 'PROV-003', 'name' => 'Accesorios Premium', 'business_name' => 'Accesorios Premium SRL', 'tax_id' => '131-3333333-3', 'email' => 'pedidos@accesoriospremium.com', 'phone' => '809-300-3000', 'contact_person' => 'Fernando Castillo', 'address' => 'Calle El Conde #200', 'city' => 'Santo Domingo', 'credit_limit' => 100000, 'balance' => 15000, 'discount_percent' => 3, 'payment_terms' => 'contado', 'category' => 'accesorios', 'notes' => 'Importador de carteras y relojes'],
            ['code' => 'PROV-004', 'name' => 'Deportes Total', 'business_name' => 'Deportes Total SAS', 'tax_id' => '131-4444444-4', 'email' => 'ventas@deportestotal.com', 'phone' => '809-400-4000', 'contact_person' => 'Ricardo Pérez', 'address' => 'Av. 27 de Febrero #500', 'city' => 'Santo Domingo', 'credit_limit' => 150000, 'balance' => 32000, 'discount_percent' => 6, 'payment_terms' => '30-dias', 'category' => 'calzado', 'notes' => 'Distribuidor Nike y Adidas'],
            ['code' => 'PROV-005', 'name' => 'Ropa Joven SRL', 'business_name' => 'Ropa Joven SRL', 'tax_id' => '131-5555555-5', 'email' => 'ventas@ropajoven.com', 'phone' => '809-500-5000', 'contact_person' => 'Diana Vargas', 'address' => 'Calle San Martín #89', 'city' => 'Santiago', 'state' => 'Santiago', 'credit_limit' => 80000, 'balance' => 0, 'discount_percent' => 4, 'payment_terms' => '15-dias', 'category' => 'ropa', 'notes' => 'Ropa casual juvenil'],
        ];

        foreach ($suppliers as $data) {
            Supplier::create(array_merge($data, ['company_id' => 1]));
        }
    }
}
