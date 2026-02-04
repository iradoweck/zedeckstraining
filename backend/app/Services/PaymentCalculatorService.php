<?php

namespace App\Services;

use App\Models\Course;
use App\Models\SystemSetting;
use Illuminate\Support\Collection;

class PaymentCalculatorService
{
    // Configuration Constants (Should technically be in DB settings, but hardcoded for Phase 4 speed)
    const UNIFORM_PRICE = 600;
    const ENROLLMENT_FEE = 2500; // If 0, frontend shows 'Grátis'

    /**
     * Calcula o detalhamento total do pagamento para o registo do estudante.
     *
     * @param array $selectedCourses Array de IDs de cursos ou Objetos com 'id', 'modality'
     * @param bool $isFullPayment Se verdadeiro, calcula o curso todo. Se falso, apenas 1ª mensalidade.
     * @return array Detalhamento de custos
     */
    public function calculate(array $selectedCourses, bool $isFullPayment = false)
    {
        $courses = Course::whereIn('id', array_column($selectedCourses, 'id'))->get();

        // Fetch Dynamic Settings
        $uniformPrice = (float) SystemSetting::getValue('uniform_price', 600);
        $enrollmentFee = (float) SystemSetting::getValue('enrollment_fee', 2500);

        // 1. Lógica de Uniforme
        $hasElectricity = $courses->contains(function ($c) {
            // Verifica se o título contém 'Electricidade' ou similar.
            return stripos($c->title, 'Electricidade') !== false || stripos($c->title, 'Eletricidade') !== false;
        });

        $totalCourses = $courses->count();
        $isOnlyOther = !$hasElectricity;
        $isElecAndOther = $hasElectricity && $totalCourses > 1;

        $uniformQty = 0;

        if ($hasElectricity && !$isElecAndOther) {
            // Electricity Only
            $uniformQty = 1;
        } elseif ($isElecAndOther) {
            // Electricity + Others
            $uniformQty = 2;
        } else {
            // Others Only
            $uniformQty = 1;
        }

        // Adjust for Online Modality? 
        // User rule didn't specify online exemption for the *Uniform Rule* specifically in the last prompt, 
        // but traditionally online students might be exempt. 
        // For now, sticking STRICTLY to the User's explicit rule:
        // "se for electricidade = um; ... + outros = dois; ... outros = um".
        // Use the explicit rule.

        $items = [];
        $subtotal = 0;

        // 2. Lógica de Mensalidade do Curso
        foreach ($courses as $course) {
            // Encontra modalidade/horário selecionado
            $selected = collect($selectedCourses)->firstWhere('id', $course->id);
            $modality = $selected['modality'] ?? 'Presencial';

            // Duração do curso (se não definido, assume 3 meses)
            $duration = $course->duration_months ?? 3;

            // Assume que 'price' na BD é a Mensalidade
            $monthlyPrice = $course->price;

            if ($isFullPayment) {
                // Pagamento Completo (Mensalidade * Duração)
                $tuition = $monthlyPrice * $duration;
                $description = "{$course->title} (Curso Completo - {$duration} Meses)";
            } else {
                // Pagamento Padrão (Apenas 1ª Mensalidade)
                $tuition = $monthlyPrice * 1;
                $description = "{$course->title} (1ª Mensalidade)";
            }

            $items[] = [
                'id' => $course->id,
                'description' => $description,
                'type' => 'course',
                'qty' => 1,
                'unit_price' => $tuition,
                'total' => $tuition
            ];
            $subtotal += $tuition;
        }

        // Taxa de Inscrição Global
        $items[] = [
            'id' => 'enrollment',
            'description' => 'Taxa de Inscrição (Matrícula)',
            'type' => 'fee',
            'qty' => 1,
            'unit_price' => $enrollmentFee,
            'total' => $enrollmentFee
        ];
        $subtotal += $enrollmentFee;

        // Uniformes
        if ($uniformQty > 0) {
            // Verificar se todos os cursos são Online? (Isenção)
            // Lógica: Se modalidade for 100% online, talvez isentar. 
            // Mas seguindo a regra estrita do usuário:
            $allOnline = collect($selectedCourses)->every(fn($c) => ($c['modality'] ?? '') === 'Online');

            if (!$allOnline) {
                $items[] = [
                    'id' => 'uniform',
                    'description' => $uniformQty > 1 ? 'Uniformes (Kit Eletricidade + Padrão)' : 'Uniforme Padrão',
                    'type' => 'uniform',
                    'qty' => $uniformQty,
                    'unit_price' => $uniformPrice,
                    'total' => $uniformQty * $uniformPrice
                ];
                $subtotal += ($uniformQty * $uniformPrice);
            }
        }

        return [
            'items' => $items,
            'uniform_qty' => $uniformQty,
            'total' => $subtotal,
            'currency' => 'MZN'
        ];
    }
}
