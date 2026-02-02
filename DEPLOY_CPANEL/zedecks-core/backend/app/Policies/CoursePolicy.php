<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CoursePolicy
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
        return true; // Everyone can view the list of courses (public)
    }

    public function view(User $user, Course $course): bool
    {
        return true; // Courses are public
    }

    public function create(User $user): bool
    {
        return $user->role === 'trainer';
    }

    public function update(User $user, Course $course): bool
    {
        return $user->role === 'trainer' && $course->trainer_id === $user->id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->role === 'trainer' && $course->trainer_id === $user->id;
    }

    public function restore(User $user, Course $course): bool
    {
        // Only admin restored via before()
        return false;
    }

    public function forceDelete(User $user, Course $course): bool
    {
        // Only admin via before()
        return false;
    }
}
