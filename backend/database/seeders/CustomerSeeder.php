<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            ['code' => 'CLI-001', 'name' => 'Juan Pérez', 'business_name' => null, 'tax_id' => '001-1234567-8', 'email' => 'juan.perez@email.com', 'phone' => '809-111-2233', 'mobile' => '829-111-2233', 'address' => 'Calle Las Flores #12', 'city' => 'Santo Domingo', 'category' => 'regular', 'credit_limit' => 15000, 'balance' => 0, 'discount_percent' => 0, 'payment_terms' => 'contado', 'notes' => 'Cliente frecuente'],
            ['code' => 'CLI-002', 'name' => 'María Rodríguez', 'business_name' => null, 'tax_id' => '001-2345678-9', 'email' => 'maria.rodriguez@email.com', 'phone' => '809-222-3344', 'mobile' => '829-222-3344', 'address' => 'Av. Abraham Lincoln #345', 'city' => 'Santo Domingo', 'category' => 'regular', 'credit_limit' => 25000, 'balance' => 5495, 'discount_percent' => 5, 'payment_terms' => '30-dias', 'notes' => 'Cliente crédito'],
            ['code' => 'CLI-003', 'name' => 'Carlos Jiménez', 'business_name' => 'Jiménez Comercial SRL', 'tax_id' => '131-3456789-0', 'email' => 'cjimenez@jimenecomercial.com', 'phone' => '809-333-4455', 'mobile' => '849-333-4455', 'address' => 'Calle Benito Juárez #78', 'city' => 'Santiago', 'state' => 'Santiago', 'category' => 'corporativo', 'credit_limit' => 100000, 'balance' => 23400, 'discount_percent' => 10, 'payment_terms' => '60-dias', 'notes' => 'Cliente corporativo mayorista'],
            ['code' => 'CLI-004', 'name' => 'Ana Martínez', 'business_name' => null, 'tax_id' => '001-4567890-1', 'email' => 'ana.mtz@email.com', 'phone' => '809-444-5566', 'mobile' => '829-444-5566', 'address' => 'Calle El Sol #56', 'city' => 'Santo Domingo', 'category' => 'regular', 'credit_limit' => 10000, 'balance' => 0, 'discount_percent' => 0, 'payment_terms' => 'contado', 'notes' => null],
            ['code' => 'CLI-005', 'name' => 'Pedro Sánchez', 'business_name' => 'Sánchez Distribuciones', 'tax_id' => '131-5678901-2', 'email' => 'pedro@sanchezdist.com', 'phone' => '809-555-6677', 'mobile' => '849-555-6677', 'address' => 'Av. España #200', 'city' => 'Santo Domingo', 'category' => 'corporativo', 'credit_limit' => 75000, 'balance' => 12500, 'discount_percent' => 8, 'payment_terms' => '30-dias', 'notes' => 'Distribuidor zona Este'],
            ['code' => 'CLI-006', 'name' => 'Laura Castillo', 'business_name' => null, 'tax_id' => '001-6789012-3', 'email' => 'laura.c@email.com', 'phone' => '809-666-7788', 'mobile' => '829-666-7788', 'address' => 'Calle Primera #34', 'city' => 'Los Alcarrizos', 'category' => 'regular', 'credit_limit' => 5000, 'balance' => 0, 'discount_percent' => 0, 'payment_terms' => 'contado', 'notes' => null],
            ['code' => 'CLI-007', 'name' => 'Roberto Díaz', 'business_name' => 'Díaz Fashion Store', 'tax_id' => '131-7890123-4', 'email' => 'roberto@diazfashion.com', 'phone' => '809-777-8899', 'mobile' => '849-777-8899', 'address' => 'Calle Duarte #123', 'city' => 'La Romana', 'state' => 'La Romana', 'category' => 'corporativo', 'credit_limit' => 50000, 'balance' => 0, 'discount_percent' => 7, 'payment_terms' => '15-dias', 'notes' => 'Tienda de ropa La Romana'],
            ['code' => 'CLI-008', 'name' => 'Carmen López', 'business_name' => null, 'tax_id' => '001-8901234-5', 'email' => 'carmen.l@email.com', 'phone' => '809-888-9900', 'mobile' => '829-888-9900', 'address' => 'Av. Independencia #567', 'city' => 'Santo Domingo', 'category' => 'premium', 'credit_limit' => 30000, 'balance' => 8990, 'discount_percent' => 5, 'payment_terms' => '30-dias', 'notes' => 'Cliente premium'],
        ];

        foreach ($customers as $data) {
            Customer::create(array_merge($data, ['company_id' => 1]));
        }
    }
}
