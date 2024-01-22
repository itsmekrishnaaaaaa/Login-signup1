-- registration.sql

-- Create a database if not exists
CREATE DATABASE IF NOT EXISTS `your_database_name`;

-- Use the database
USE `your_database_name`;

-- Create a 'users' table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL
);

-- Ensure UTF-8 character set
ALTER TABLE `users` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
