-- This script runs on startup to populate the database with initial data.

-- Insert the essential user roles if they don't already exist.
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_STUDENT') ON DUPLICATE KEY UPDATE name=name;

-- Insert a default admin user with the CORRECT password hash.
-- The username is 'admin' and the password is 'admin123'.
INSERT INTO users (id, username, password, full_name, email, wallet_balance)
VALUES (1, 'admin', '$2a$10$Upuj.w.S8NqlLP65bFsKb.ej1q2AGZVUyrlOt2xiV.T4lVa6tBjhi', 'Admin User', 'admin@cc.com', 0.00)
ON DUPLICATE KEY UPDATE username=username;

-- Assign the 'ROLE_ADMIN' to the user with id=1 (our admin user).
INSERT INTO user_roles (user_id, role_id)
SELECT 1, 1
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 1 AND role_id = 1);