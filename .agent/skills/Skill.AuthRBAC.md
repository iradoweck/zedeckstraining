# Skill.AuthRBAC

## Objective
Implement Role-Based Access Control using Laravel Sanctum and Policies/Gates.

## Instructions
1. **Roles**: Define `admin`, `trainer`, `student`.
2. **Permissions**: Granular actions (e.g., `course.create`, `grade.update`).
3. **Implementation**:
   - Use Middleware `auth:sanctum`.
   - Use Policies for model-based authorization (`$user->can('update', $course)`).
   - Return `403 Forbidden` for unauthorized access.
4. **Frontend Integration**:
   - Store user role in global state/context.
   - Conditionally render UI elements based on role.
