-- Users Table:

-- user_id (INT, PRIMARY KEY)
-- username (VARCHAR(255), UNIQUE)
-- passwordHash (VARCHAR(255))
-- role (VARCHAR(20), ('member', 'librarian'))

-- Books Table:

-- book_id (INT, PRIMARY KEY)
-- title (VARCHAR(255))
-- author (VARCHAR(255))
-- availability (CHAR(1), ('Y', 'N'))

-- CREATE TABLE Users (
--   id INT PRIMARY KEY IDENTITY,
--   username VARCHAR(50) NOT NULL UNIQUE,
--   email VARCHAR(100) NOT NULL UNIQUE
-- );

USE master;
GO
IF DB_ID (N'lib_api') IS NOT NULL
DROP DATABASE lib_api;
GO
CREATE DATABASE lib_api;
GO

USE lib_api;
GO

CREATE TABLE Books (
  book_id INT PRIMARY KEY IDENTITY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  availability CHAR(1) CHECK (availability='Y' or availability='N')
);


INSERT INTO Books (title, author, availability)
VALUES
  ('To Kill a Mockingbird', 'Harper Lee', 'Y'),
  ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'Y'),
  ('Dune', 'Frank Herbert', 'Y'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Y');

CREATE TABLE Users (
  user_id INT PRIMARY KEY IDENTITY,
  username VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255),
  role VARCHAR(20) CHECK (role='member' or role='library')
);

-- Insert sample users
INSERT INTO Users (username)
VALUES
  ('user1'),
  ('user2'),
  ('user3');

-- Insert relationships between users and books
INSERT INTO UserBooks (user_id, book_id)
VALUES
  (1, 1),  -- User 1 has book 1
  (1, 2),  -- User 1 has book 2
  (1, 4),  -- User 1 has book 4
  (2, 3),  -- User 2 has book 3
  (2, 2),  -- User 2 has book 5
  (3, 1),  -- User 3 has book 1
  (3, 3);  -- User 3 has book 6