const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
constructor(user_id, username, passwordHash, role) {
    this.user_id = user_id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new User(row.user_id, row.username, row.passwordHash, row.role)
    ); // Convert rows to User objects
  }

  static async createUser(newUserData) {
    console.log(`${JSON.stringify(newUserData)} at createUser user Model`)
    console.log(`${newUserData.username} at createUser user Model`)

    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@username, @hashedPassword, @role); SELECT SCOPE_IDENTITY() AS user_id;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("username", newUserData.username);
    request.input("hashedPassword", newUserData.hashedPassword);
    request.input("role", newUserData.role);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created user using its user_id
    console.log(result.recordset[0].user_id - 1);
    return this.getUserById(result.recordset[0].user_id - 1);
  }

  static async updateUser(id, newUserData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Users SET username = @username, passwordHash = @passwordHash, role = @role WHERE user_id = @id`; // Parameterized query

    const request = connection.request();
    request.input("user_id", id);
    request.input("username", newUserData.username || null); // Handle optional fields
    request.input("passwordHash", newBookData.passwordHash || null);
    request.input("role", newBookData.role || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getUserById(id); // returning the updated book data
  }

  static async deleteUser(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Users WHERE user_id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }

  static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM Users
        WHERE user_id LIKE '%${searchTerm}%'
          OR role LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);
      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }

  static async getUsersWithBooks() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.user_id AS id, u.username, u.passwordHash, b.book_id AS book_id, b.title, b.author, b.availability
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.user_id
        LEFT JOIN Books b ON ub.book_id = b.book_id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their books
      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            id: userId,
            username: row.username,
            email: row.passwordHash,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }

  static async getUserByUsername(username) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE username = @username`; // Parameterized query

    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].user_id,
          result.recordset[0].username,
          result.recordset[0].passwordHash,
          result.recordset[0].role
        )
      : null; // Handle user not found
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE user_id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new User(
          result.recordset[0].user_id,
          result.recordset[0].username,
          result.recordset[0].passwordHash,
          result.recordset[0].role
        )
      : null; // Handle user not found
  }
}

module.exports = User;
