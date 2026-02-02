<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\AcademicClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EnrollmentController extends Controller
{
    public function index(Request $request) 
    {
        // Trainers see enrollments for their classes
        $user = $request->user();
        
        if ($user->role === 'trainer') {
            return Enrollment::whereHas('academicClass.course', function($q) use ($user) {
                $q->where('trainer_id', $user->id);
            })->with(['user', 'academicClass'])->get();
        }

        return [];
    }

    public function store(Request $request)
    {
        // Simple manual enrollment for now
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'user_id' => 'required|exists:users,id' // Trainer enrolling a student
        ]);

        $class = AcademicClass::with('course')->findOrFail($validated['class_id']);

        // Check if user is trainer of the course
        if ($request->user()->role !== 'admin' && $class->course->trainer_id !== $request->user()->id) {
            abort(403, 'Only the trainer can enroll students manually');
        }

        $enrollment = Enrollment::create([
            'class_id' => $validated['class_id'],
            'user_id' => $validated['user_id'],
            'status' => 'active',
            'enrolled_at' => now()
        ]);

        return response()->json($enrollment, 201);
    }
}
