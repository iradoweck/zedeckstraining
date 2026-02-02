<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    public function index()
    {
        // Public list of published courses
        return Course::where('is_published', true)->with('trainer:id,name,profile_photo')->get();
    }

    public function show($id)
    {
        $course = Course::with(['trainer:id,name,profile_photo', 'modules.lessons', 'classes'])->findOrFail($id);
        return $course;
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Course::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:courses,slug',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
        ]);

        $course = $request->user()->courses()->create($validated);

        return response()->json($course, 201);
    }

    public function update(Request $request, Course $course)
    {
        Gate::authorize('update', $course);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'is_published' => 'boolean'
        ]);

        $course->update($validated);

        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        Gate::authorize('delete', $course);
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
