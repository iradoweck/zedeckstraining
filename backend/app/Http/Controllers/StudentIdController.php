<?php

namespace App\Http\Controllers;

use App\Models\StudentId;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentIdController extends Controller
{
    /**
     * Check if a document number already has a Student ID.
     */
    public function check(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_number' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Document number required'], 400);
        }

        $studentId = StudentId::where('document_number', $request->document_number)->first();

        if ($studentId) {
            return response()->json([
                'exists' => true,
                'student_id' => $studentId,
                'message' => 'Student ID found for this document.'
            ]);
        }

        return response()->json([
            'exists' => false,
            'message' => 'No Student ID found.'
        ]);
    }

    /**
     * Generate a NEW Student ID for a document number.
     */
    public function generate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_number' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Double check existence to prevent race conditions or duplicates
        $existing = StudentId::where('document_number', $request->document_number)->first();
        if ($existing) {
             return response()->json([
                'success' => true,
                'student_id' => $existing, // Return existing if found
                'is_new' => false
            ]);
        }

        // Generate Logic
        $code = StudentId::generateUniqueCode();

        $studentId = StudentId::create([
            'student_code' => $code,
            'document_number' => $request->document_number,
            'year' => date('Y'),
            'status' => 'active',
            'metadata' => [
                'original_name' => "{$request->first_name} {$request->last_name}",
                'generated_at' => now()->toIso8601String()
            ]
        ]);

        return response()->json([
            'success' => true,
            'student_id' => $studentId,
            'is_new' => true
        ], 201);
    }
}
