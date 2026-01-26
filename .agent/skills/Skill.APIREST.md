# Skill.APIREST

## Objective
Standards for building clean, consistent RESTful APIs.

## Instructions
1. **Response Format (JSON)**:
   ```json
   {
     "success": true,
     "data": { ... },
     "message": "Operation successful"
   }
   ```
   or error:
   ```json
   {
     "success": false,
     "errors": { "field": ["Error detail"] },
     "message": "Validation failed"
   }
   ```
2. **Status Codes**:
   - 200 OK, 201 Created.
   - 400 Bad Request, 401 Unauth, 403 Forbidden, 404 Not Found.
   - 422 Validation Error.
   - 500 Server Error.
3. **Versioning**: Prefix routes with `/api/v1/...`.
4. **Pagination**: Use Laravel's `paginate()` logic (meta/dinks).
