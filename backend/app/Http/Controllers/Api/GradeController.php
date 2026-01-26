<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    // Store or Update a grade for a specific enrollment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'assignment_name' => 'required|string',
            'score' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string'
        ]);

        $enrollment = Enrollment::with('academicClass.course')->findOrFail($validated['enrollment_id']);

        // Check auth: Only trainer of the course can grade
        $user = $request->user();
        if ($user->role !== 'admin' && $enrollment->academicClass->course->trainer_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $grade = Grade::updateOrCreate(
            [
                'enrollment_id' => $validated['enrollment_id'],
                'assignment_name' => $validated['assignment_name']
            ],
            [
                'score' => $validated['score'],
                'feedback' => $validated['feedback']
            ]
        );

        return response()->json($grade, 201);
    }

    // Get grades for an enrollment (Student views own, Trainer views student's)
    public function index(Request $request)
    {
        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id'
        ]);

        $enrollment = Enrollment::with('academicClass.course')->findOrFail($validated['enrollment_id']);
        $user = $request->user();

        // Trainer check
        if ($user->role === 'trainer' && $enrollment->academicClass->course->trainer_id === $user->id) {
             return $enrollment->grades;
        }

        // Student check
        if ($user->role === 'student' && $enrollment->user_id === $user->id) {
            return $enrollment->grades;
        }

         abort(403, 'Unauthorized');
    }
}
