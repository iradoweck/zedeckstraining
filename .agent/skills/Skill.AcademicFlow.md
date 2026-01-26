# Skill.AcademicFlow

## Objective
Standardize the lifecycle of academic entities (Student, Course, Class).

## Instructions
1. **Enrollment Flow**:
   - Statuses: `pending_payment` -> `active` -> `completed` -> `dropped`.
   - Action: Updating status must trigger events (e.g., Grant Access, Send Email).
2. **Class Flow**:
   - `scheduled` -> `in_progress` -> `completed` -> `archived`.
   - Attendance is locked after `completed`.
3. **Certification**:
   - Requirement: 100% Modules viewed + Passing Grade.
   - Output: PDF with Unique Verification Code.
