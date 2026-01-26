# Skill.DeploymentCPanel

## Objective
Guide for deploying the full system to a cPanel shared hosting environment.

## Instructions
1. **Build**:
   - Frontend: `npm run build` -> Zip `dist/` or `build/`.
   - Backend: Cleaning `node_modules`.
2. **Upload**:
   - Backend goes to a non-public folder (e.g., `~/repositories/zt-backend`).
   - Frontend static files go to `public_html` (or subdomain folder).
3. **Configuration**:
   - Symlink `public/storage` to `storage/app/public`.
   - Update `.env` with DB credentials and paths.
   - Set `APP_URL`, `ASSET_URL`.
4. **Database**:
   - Create DB & User in cPanel.
   - Import migration SQL dump or run migrations via SSH if available.
