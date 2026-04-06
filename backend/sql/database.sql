-- ============================================================
-- IELTS 2026 Exam Simulator - Database Setup
-- On db4free.net: skip the CREATE DATABASE and USE lines.
-- Your database already exists. Start from CREATE TABLE.
-- ============================================================

-- Drop tables in reverse order to avoid foreign key conflicts
DROP TABLE IF EXISTS subscription_requests;
DROP TABLE IF EXISTS exam_results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_subscribed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section ENUM('reading', 'listening', 'writing', 'speaking') NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- EXAM RESULTS
CREATE TABLE IF NOT EXISTS exam_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  section ENUM('reading', 'listening', 'writing', 'speaking') NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  band_score DECIMAL(3,1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SUBSCRIPTION REQUESTS
CREATE TABLE IF NOT EXISTS subscription_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_ref VARCHAR(120) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SAMPLE QUESTIONS
-- On mobile phpMyAdmin: run each INSERT separately, one at a time
INSERT INTO questions (section, question_text, option_a, option_b, option_c, option_d, correct_option)
VALUES ('reading', 'What is the main idea of the passage?', 'Option A', 'Option B', 'Option C', 'Option D', 'A');

INSERT INTO questions (section, question_text, option_a, option_b, option_c, option_d, correct_option)
VALUES ('reading', 'Which statement is TRUE according to the text?', 'Option A', 'Option B', 'Option C', 'Option D', 'B');

INSERT INTO questions (section, question_text, option_a, option_b, option_c, option_d, correct_option)
VALUES ('reading', 'What does the author imply?', 'Option A', 'Option B', 'Option C', 'Option D', 'C');

-- ADMIN ACCOUNT
-- Do NOT use a placeholder hash in production.
-- Safest method: register from the frontend, then run:
-- UPDATE users SET role='admin', is_subscribed=1 WHERE email='youremail@example.com';
