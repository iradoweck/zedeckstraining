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
    // OR Get all grades for a class (Trainer views gradebook)
    public function index(Request $request)
    {
        $user = $request->user();

        if ($request->has('class_id')) {
            $classId = $request->validate(['class_id' => 'exists:classes,id'])['class_id'];
            $academicClass = \App\Models\AcademicClass::with('course')->findOrFail($classId);

            // Trainer check
            if ($user->role !== 'admin' && $academicClass->course->trainer_id !== $user->id) {
                abort(403, 'Unauthorized');
            }

            // Return all grades for this class, eager load enrollment and user
            return Grade::whereHas('enrollment', function ($query) use ($classId) {
                $query->where('class_id', $classId);
            })->with('enrollment.user')->get();
        }

        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id'
        ]);

        $enrollment = Enrollment::with('academicClass.course')->findOrFail($validated['enrollment_id']);

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
