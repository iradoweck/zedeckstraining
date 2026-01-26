<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AcademicClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AttendanceController extends Controller
{
    // Record attendance for a specific class date
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.user_id' => 'required|exists:users,id',
            'attendances.*.status' => 'required|in:present,absent,excused'
        ]);

        $class = AcademicClass::with('course')->findOrFail($validated['class_id']);

        // Check if user is trainer of the course or admin
        if ($request->user()->role !== 'admin' && $class->course->trainer_id !== $request->user()->id) {
             abort(403, 'Unauthorized');
        }

        foreach ($validated['attendances'] as $record) {
            Attendance::updateOrCreate(
                [
                    'class_id' => $validated['class_id'],
                    'user_id' => $record['user_id'],
                    'date' => $validated['date']
                ],
                ['status' => $record['status']]
            );
        }

        return response()->json(['message' => 'Attendance recorded successfully']);
    }

    // Get attendance for a specific class (Trainer view: all students, Student view: own)
    public function index(Request $request) 
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'nullable|date'
        ]);

        $class = AcademicClass::with('course')->findOrFail($validated['class_id']);
        $user = $request->user();

        $query = Attendance::where('class_id', $class->id);

        if ($request->has('date')) {
            $query->where('date', $validated['date']);
        }

        if ($user->role === 'trainer') {
            if ($class->course->trainer_id !== $user->id) abort(403);
            return $query->get();
        }

        if ($user->role === 'student') {
            // Check if student is enrolled
             if (!$class->enrollments()->where('user_id', $user->id)->exists()) abort(403);
             return $query->where('user_id', $user->id)->get();
        }

        return abort(403);
    }
}
