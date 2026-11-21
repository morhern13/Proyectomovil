<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        Company::create([
            'name' => 'Candace Demo',
            'legal_name' => 'Candace Comercial SRL',
            'tax_id' => '131-45678-9',
            'email' => 'info@candacedemo.com',
            'phone' => '809-555-0101',
            'address' => 'Calle 93 #12-34',
            'city' => 'Bogotá',
            'state' => 'Cundinamarca',
            'country' => 'CO',
            'currency' => 'COP',
            'currency_symbol' => '$',
            'locale' => 'es',
            'timezone' => 'America/Bogota',
            'is_active' => true,
        ]);

        Company::create([
            'name' => 'Moda Sport',
            'legal_name' => 'Moda Sport Import SRL',
            'tax_id' => '132-98765-4',
            'email' => 'ventas@modasport.com',
            'phone' => '809-555-0202',
            'address' => 'Cra 7 #72-15',
            'city' => 'Bogotá',
            'state' => 'Cundinamarca',
            'country' => 'CO',
            'currency' => 'COP',
            'currency_symbol' => '$',
            'locale' => 'es',
            'timezone' => 'America/Bogota',
            'is_active' => true,
        ]);
    }
}
