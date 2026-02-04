<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PaymentCalculatorService;
use App\Models\StudentId;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    protected $calculator;

    public function __construct(PaymentCalculatorService $calculator)
    {
        $this->calculator = $calculator;
    }

    /**
     * Calculate payment details.
     */
    public function calculate(Request $request)
    {
        $request->validate([
            'courses' => 'required|array',
            'courses.*.id' => 'required|exists:courses,id',
            'courses.*.modality' => 'nullable|string',
            'payment_plan' => 'required|in:full,monthly'
        ]);

        $breakdown = $this->calculator->calculate(
            $request->courses,
            $request->payment_plan === 'full'
        );

        // Generate a provisional reference for the UI
        $year = date('Y');
        $random = strtoupper(Str::random(4));
        $reference = "ZT-PAY-{$year}-{$random}";

        return response()->json([
            'success' => true,
            'breakdown' => $breakdown,
            'reference' => $reference
        ]);
    }
}
