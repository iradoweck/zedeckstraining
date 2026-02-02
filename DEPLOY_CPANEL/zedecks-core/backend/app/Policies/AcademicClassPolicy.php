<?php

namespace App\Policies;

use App\Models\AcademicClass;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AcademicClassPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->role === 'trainer' || $user->role === 'student';
    }

    public function view(User $user, AcademicClass $academicClass): bool
    {
        if ($user->role === 'trainer') {
            // Trainer can view classes of their courses
            return $academicClass->course->trainer_id === $user->id;
        }

        if ($user->role === 'student') {
            // Student can view classes they are enrolled in
            return $academicClass->enrollments()->where('user_id', $user->id)->exists();
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'trainer';
    }

    public function update(User $user, AcademicClass $academicClass): bool
    {
        return $user->role === 'trainer' && $academicClass->course->trainer_id === $user->id;
    }

    public function delete(User $user, AcademicClass $academicClass): bool
    {
        return $user->role === 'trainer' && $academicClass->course->trainer_id === $user->id;
    }

    public function restore(User $user, AcademicClass $academicClass): bool
    {
        return false;
    }

    public function forceDelete(User $user, AcademicClass $academicClass): bool
    {
        return false;
    }
}
