//setup a mysql database connection
const mysql = require("mysql2");

const pool = mysql
  .createPool({
    user: process.env.MYSQL_USER || "root",
    host: process.env.MYSQL_HOST || "localhost",
    database: process.env.MYSQL_DATABASE || "pethealthcare",
    password: process.env.MYSQL_PASSWORD || "",
    port: Number(process.env.MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    decimalNumbers: false,
    ssl:
      process.env.MYSQL_SSL === "true"
        ? {
            rejectUnauthorized:
              process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : undefined,
  })
  .promise();

module.exports = pool;
