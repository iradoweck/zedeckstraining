<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AcademicClassController extends Controller
{
    public function index(Request $request)
    {
        // Trainers see their classes, Students see enrolled classes
        $user = $request->user();
        
        if ($user->role === 'trainer') {
            return AcademicClass::whereHas('course', function($q) use ($user) {
                $q->where('trainer_id', $user->id);
            })->with('course')->get();
        }

        if ($user->role === 'student') {
            return AcademicClass::whereHas('enrollments', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with('course')->get();
        }

        if ($user->role === 'admin') {
            return AcademicClass::with('course')->get();
        }

        return [];
    }

    public function store(Request $request)
    {
        Gate::authorize('create', AcademicClass::class);

        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'name' => 'required|string',
            'start_date' => 'nullable|date',
            'format' => 'required|in:in-person,online',
            'location' => 'nullable|string'
        ]);

        // Ensure trainer owns the course
        $course = Course::findOrFail($validated['course_id']);
        if ($request->user()->role !== 'admin' && $course->trainer_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $class = AcademicClass::create($validated);
        return response()->json($class, 201);
    }

    public function show(AcademicClass $academicClass)
    {
        Gate::authorize('view', $academicClass);
        return $academicClass->load(['course', 'enrollments.user', 'attendances']);
    }
}
