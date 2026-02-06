<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\StudentId;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|string|in:admin,trainer,student',

            // Profile
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'father_name' => 'nullable|string',
            'mother_name' => 'nullable|string',
            'gender' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'document_type' => 'nullable|string',
            'document_number' => 'nullable|string',
            'phone' => 'nullable|string', // Check if user has phone column? Assuming it uses profile fields
            'province' => 'nullable|string',
            'city' => 'nullable|string',

            'student_code' => 'nullable|string|unique:users,student_code',

            // Enrollment Data
            'courses' => 'required|array',
            'payment' => 'nullable|array', // { reference, method, amount, status }
        ]);

        try {
            DB::beginTransaction();

            // 2. Create User
            // Combine first/last if needed, but we have 'name' input. 
            // Register.jsx sends 'name' combined and 'first_name'/'last_name' separately.
            // Users table has 'name'. It also has expanded profile fields.

            $userPayload = $request->only([
                'name',
                'email',
                'role',
                'father_name',
                'mother_name',
                'gender',
                'marital_status',
                'occupation',
                'nationality',
                'birth_date',
                'document_type',
                'document_number',
                'education_level',
                'has_special_needs',
                'special_needs_description',
                'student_code'
            ]);

            $userPayload['password'] = Hash::make($request->password);
            $userPayload['role'] = $request->role ?? 'student';

            $user = User::create($userPayload);

            // 3. Handle Payment
            $paymentId = null;
            if ($request->has('payment') && !empty($request->payment)) {
                $payData = $request->payment;

                // Ensure required payment fields
                if (isset($payData['reference'], $payData['amount'], $payData['method'])) {
                    $payment = Payment::create([
                        'user_id' => $user->id,
                        'reference' => $payData['reference'],
                        'amount' => $payData['amount'],
                        'currency' => 'MZN',
                        'method' => $payData['method'],
                        'status' => $payData['status'] ?? 'pending',
                        'metadata' => [
                            'student_code' => $user->student_code,
                            'courses_count' => count($request->courses)
                        ]
                    ]);
                    $paymentId = $payment->id;
                }
            }

            // 4. Handle Enrollments
            $courses = $request->input('courses');

            foreach ($courses as $courseItem) {
                // Determine ID, Modality, and Schedule
                if (is_array($courseItem)) {
                    $courseId = $courseItem['id'];
                    $modality = $courseItem['modality'] ?? 'Presencial';
                    $schedule = $courseItem['schedule'] ?? null;
                } else {
                    $courseId = $courseItem;
                    $modality = 'Presencial';
                    $schedule = null;
                }

                // Create Enrollment
                Enrollment::create([
                    'user_id' => $user->id,
                    'course_id' => $courseId,
                    'status' => 'pending', // Pending admin approval or payment confirmation
                    'options' => [
                        'modality' => $modality,
                        'schedule' => $schedule,
                        'payment_id' => $paymentId
                    ],
                    'enrolled_at' => now()
                ]);
            }

            // 5. Update StudentId status if used
            if ($user->student_code) {
                $sid = StudentId::where('student_code', $user->student_code)->first();
                if ($sid) {
                    $sid->update(['status' => 'used']);
                }

                // Or create it if it doesn't exist (if passed from frontend but not generated via API)?
                // Generally we trust the unique constraint on users table.
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Conta criada com sucesso!',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Registration Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar conta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
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

    /*
    |--------------------------------------------------------------------------
    | Password Recovery
    |--------------------------------------------------------------------------
    */

    public function forgotPassword(Request $request)
    {
        $request->validate(['identifier' => 'required']);

        // Check if identifier is email or student code
        $fieldType = filter_var($request->identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'student_code';

        $user = User::where($fieldType, $request->identifier)->first();

        // Security: Always return success even if user not found to prevent enumeration
        // But if found, we send the email.
        if ($user && $user->email) {
            // We use standard Laravel Password Broker
            // Or manually create token in password_resets table

            // For simplicity and standard behavior, let's use the standard Password facade logic manually
            // to support our dual identifier logic but send to the email found.

            $token = \Illuminate\Support\Facades\Password::createToken($user);

            // Send Email
            // Note: In production you should have a Notification class.
            // For now, we use the built-in notification or a simple Mail class.
            // Laravel User model uses CanResetPassword trait usually.

            $user->sendPasswordResetNotification($token);
        }

        return response()->json(['message' => 'Link de redefinição enviado se a conta existir.']);
    }

    public function resetPassword(Request $request)
    {
        Log::info("Reset Password Attempt:", ['email' => $request->email, 'token_sample' => substr($request->token, 0, 10) . '...']);

        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(\Illuminate\Support\Str::random(60));

                $user->save();

                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        Log::info("Reset Password Result: " . $status);

        return $status === \Illuminate\Support\Facades\Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }
}
