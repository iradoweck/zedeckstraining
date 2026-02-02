<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8', // removed confirmed as frontend checks it
            'role' => 'sometimes|string|in:admin,trainer,student',
            
            // Profile
            'father_name' => 'nullable|string',
            'mother_name' => 'nullable|string',
            'gender' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'document_number' => 'nullable|string',
            
            // Enrollment Data
            'courses' => 'required', // Array or single ID
            'payment_method' => 'nullable|string',
            'payment_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        // Create User
        $userPayload = $request->only([
            'name', 'email', 'role', 
            'father_name', 'mother_name', 'gender', 'marital_status', 'occupation', 
            'nationality', 'birth_date', 'document_type', 'document_number',
            'education_level', 'has_special_needs', 'special_needs_description'
        ]);
        $userPayload['password'] = Hash::make($request->password);
        $userPayload['role'] = $request->role ?? 'student';

        $user = User::create($userPayload);

        // Handle Proof Upload
        $proofPath = null;
        if ($request->hasFile('payment_proof')) {
            $proofPath = $request->file('payment_proof')->store('payments', 'public');
        }

        // Handle Enrollments
        // Courses comes as array from FormData: courses[0]=1, courses[1]=2
        $courses = $request->input('courses');
        if (!is_array($courses)) {
            $courses = [$courses];
        }

        $options = [
            'schedule' => $request->input('schedule'),
            'exam_modality' => $request->input('exam_modality'),
            'programming_type' => $request->input('programming_type'),
            'education_level' => $request->input('education_level'),
            'student_code' => $request->input('student_code'),
        ];

        foreach ($courses as $courseId) {
            Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $courseId,
                'status' => 'pending',
                'payment_method' => $request->input('payment_method'),
                'payment_proof' => $proofPath,
                'options' => $options
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Login Attempt', $request->all());

        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Deslogado com sucesso']);
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}
