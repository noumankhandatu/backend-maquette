const mysql = require("mysql");

// node -v must > 8.x
const util = require("util");

try {
  const pool = mysql.createPool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
    connectionLimit: 1000,
    // connectTimeout: 60 * 60 * 1000,
    // acquireTimeout: 60 * 60 * 1000,
    // timeout: 60 * 60 * 1000,
  });

  // Ping database to check for common exception errors.
  pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was closed.");
      }
      if (err.code === "ER_CON_COUNT_ERROR") {
        console.error("Database has too many connections.");
      }
      if (err.code === "ECONNREFUSED") {
        console.error("Database connection was refused.");
      }
    }

    if (connection) connection.release();

    return;
  });

  pool.query = util.promisify(pool.query);

  module.exports = pool;
} catch (error) {
  console.log(`400 || pool || ${JSON.stringify(error)}`);
}
