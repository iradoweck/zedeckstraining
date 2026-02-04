<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'uniform_price',
                'value' => '600',
                'group' => 'finance',
                'description' => 'Preço unitário do uniforme padrão'
            ],
            [
                'key' => 'enrollment_fee',
                'value' => '2500',
                'group' => 'finance',
                'description' => 'Taxa de inscrição/matrícula (0 = Grátis)'
            ],
            [
                'key' => 'currency',
                'value' => 'MZN',
                'group' => 'finance',
                'description' => 'Moeda padrão do sistema'
            ]
        ];

        foreach ($settings as $setting) {
            \App\Models\SystemSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
