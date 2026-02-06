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
        $enrollmentFee = (float) SystemSetting::getValue('enrollment_fee', 2500);

        $items = [];
        $subtotal = 0;

        foreach ($courses as $course) {
            // --- 1. TUITION ---
            $monthlyPrice = (float) $course->price;
            $duration = $course->options['duration'] ?? 6; // Default to 6 if missing
            $courseTotal = 0;

            if ($isFullPayment) {
                // Full Course: Monthly x Duration
                $courseTotal = $monthlyPrice * $duration;
                $description = "{$course->title} (Curso Completo - {$duration} Meses)";
            } else {
                // Standard: 1st Month only
                $courseTotal = $monthlyPrice;
                $description = "{$course->title} (1ª Mensalidade)";
            }

            $items[] = [
                'id' => "course_{$course->id}",
                'name' => 'Curso',
                'description' => $description,
                'qty' => 1,
                'unit_price' => $courseTotal,
                'total' => $courseTotal
            ];
            $subtotal += $courseTotal;

            // --- 2. UNIFORM ---
            // "Os Cursos ... vem com: Valor de Uniforme"
            // Rule: Electricity = 2, Others = 1.
            $uniformCost = (float) ($course->options['uniform_cost'] ?? 0);

            if ($uniformCost > 0) {
                $isElectricity = (stripos($course->title, 'Electricidade') !== false || stripos($course->title, 'Eletricidade') !== false);
                $uniformQty = $isElectricity ? 2 : 1;

                $items[] = [
                    'id' => "uniform_{$course->id}",
                    'name' => 'Uniforme',
                    'description' => "Uniforme - {$course->title}",
                    'qty' => $uniformQty,
                    'unit_price' => $uniformCost,
                    'total' => $uniformCost * $uniformQty
                ];
                $subtotal += ($uniformCost * $uniformQty);
            }
        }

        // --- 3. ENROLLMENT FEE ---
        // Global fee, applied once per registration (even if multiple courses? Usually yes)
        // If user wants per course, move inside loop. Assuming global per student registration here.
        if ($enrollmentFee > 0) {
            $items[] = [
                'id' => 'enrollment',
                'name' => 'Inscrição',
                'description' => 'Taxa de Inscrição (Matrícula)',
                'qty' => 1,
                'unit_price' => $enrollmentFee,
                'total' => $enrollmentFee
            ];
            $subtotal += $enrollmentFee;
        }

        return [
            'items' => $items,
            'total' => $subtotal,
            'currency' => 'MZN'
        ];
    }
}
