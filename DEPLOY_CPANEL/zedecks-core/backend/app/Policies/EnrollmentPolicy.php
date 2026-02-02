<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EnrollmentPolicy
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
        return true; 
    }

    public function view(User $user, Enrollment $enrollment): bool
    {
        return $user->id === $enrollment->user_id || 
               ($user->role === 'trainer' && $enrollment->academicClass->course->trainer_id === $user->id);
    }

    public function create(User $user): bool
    {
        // Students can self-enroll (or via payment flow), Trainers can manually enroll
        return true; 
    }

    public function update(User $user, Enrollment $enrollment): bool
    {
        // Trainer of the course can update status
        return $user->role === 'trainer' && $enrollment->academicClass->course->trainer_id === $user->id;
    }

    public function delete(User $user, Enrollment $enrollment): bool
    {
        // Trainer can drop student
        return $user->role === 'trainer' && $enrollment->academicClass->course->trainer_id === $user->id;
    }

    public function restore(User $user, Enrollment $enrollment): bool
    {
        return false;
    }

    public function forceDelete(User $user, Enrollment $enrollment): bool
    {
        return false;
    }
}
