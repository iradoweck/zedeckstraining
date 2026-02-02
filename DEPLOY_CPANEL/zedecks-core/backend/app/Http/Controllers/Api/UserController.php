<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        // Ideally enforce admin check here or via policy
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return User::all();
    }

    public function show(User $user)
    {
         if (auth()->user()->role !== 'admin' && auth()->id() !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $user;
    }

    public function update(Request $request, User $user)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'sometimes|string|in:admin,trainer,student',
            // 'password' => 'sometimes|string|min:8' // Optional: allow admin to reset password
        ]);

        $user->update($validated);
        return $user;
    }

    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'admin') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
