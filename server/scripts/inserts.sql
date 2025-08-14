-- Insert module
INSERT INTO modules (name, description, created_at, updated_at)
VALUES ('User Management', 'Module for managing users', NOW(), NOW());

-- Insert module: Role Management
INSERT INTO modules (name, description, created_at, updated_at)
VALUES ('Role Management', 'Module for managing roles', NOW(), NOW());

-- Insert module: Permission Management
INSERT INTO modules (name, description, created_at, updated_at)
VALUES ('Permission Management', 'Module for managing permissions', NOW(), NOW());

-- Insert module: Module Management
INSERT INTO modules (name, description, created_at, updated_at)
VALUES ('Module Management', 'Module for managing modules', NOW(), NOW());

-- Get module id
-- (Assume module id is 1 for User, 2 for Role, 3 for Permission, 4 for Module)

-- Insert permissions
INSERT INTO permissions (name, description, module_id, created_at, updated_at)
VALUES 
  ('system-administration.users.create', 'Permission to create user', 1, NOW(), NOW()),
  ('system-administration.users.update', 'Permission to update user', 1, NOW(), NOW()),
  ('system-administration.users.delete', 'Permission to delete user', 1, NOW(), NOW()),
  ('system-administration.users.view', 'Permission to view user', 1, NOW(), NOW()),
  ('system-administration.roles.create', 'Permission to create role', 2, NOW(), NOW()),
  ('system-administration.roles.update', 'Permission to update role', 2, NOW(), NOW()),
  ('system-administration.roles.delete', 'Permission to delete role', 2, NOW(), NOW()),
  ('system-administration.roles.view', 'Permission to view role', 2, NOW(), NOW()),
  ('system-administration.permissions.create', 'Permission to create permission', 3, NOW(), NOW()),
  ('system-administration.permissions.update', 'Permission to update permission', 3, NOW(), NOW()),
  ('system-administration.permissions.delete', 'Permission to delete permission', 3, NOW(), NOW()),
  ('system-administration.permissions.view', 'Permission to view permission', 3, NOW(), NOW()),
  ('system-administration.modules.create', 'Permission to create module', 4, NOW(), NOW()),
  ('system-administration.modules.update', 'Permission to update module', 4, NOW(), NOW()),
  ('system-administration.modules.delete', 'Permission to delete module', 4, NOW(), NOW()),
  ('system-administration.modules.view', 'Permission to view module', 4, NOW(), NOW());

-- Insert role
INSERT INTO roles (name, description, created_at, updated_at)
VALUES ('admin', 'System administrator', NOW(), NOW());

-- Get role id
-- (Assume role id is 1 for next inserts, adjust if needed)

-- Insert user
INSERT INTO users (
  first_name, last_name, email, password, username, is_active, dark_mode, flag_password, created_at, updated_at
) VALUES (
  'Admin', 'User', 'admin@example.com', '$2b$10$r6omebWQmmcK9XTQIw12r.lu8JHB4EXKVD0SV.SaM.D90xvA6RLF.', 'admin', TRUE, FALSE, FALSE, NOW(), NOW()
);

-- Get user id
-- (Assume user id is 1 for next inserts, adjust if needed)

-- Assign admin role to user
INSERT INTO users_roles (user_id, role_id, created_at, updated_at)
VALUES (1, 1, NOW(), NOW());

-- Assign all permissions to admin role
INSERT INTO roles_permissions (role_id, permission_id, created_at, updated_at)
SELECT 1, id, NOW(), NOW() FROM permissions;