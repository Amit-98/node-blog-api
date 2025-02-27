import mysql from "mysql2";
import { db_key} from "./env_config.js";

const db_config = {
  local: {
    user: "root",
    host: "localhost",
    password: "Amit@145",
    database: "blog",
    port:3306,
    connectionLimit: 60000,
    queueLimit:50
  },
  devlopment: {
    user: "root",
    host: "localhost",
    password: "Amit@145",
    database: "blog",
    port:3306,
    connectionLimit: 5000,
  },
  production: {
    user: "root",
    host: "autorack.proxy.rlwy.net",
    password: "wmIJSxoHrnBAzhiGivXRfjfXLPwavwjc",
    database: "railway",
    port:15293,
    waitForConnections:true,
    connectionLimit: 1000,
    queueLimit:0
  },
};

const pool = mysql.createPool(db_config[db_key]);
// async function connectSqlDb()
// {
//   // let sqlConnect = mysql.createConnection(db_config[db_key]);
//   // sqlConnect.connect((err) => {
//   //   if (err) 
//   //   {
//   //     console.error("error connecting: " + err.stack);
//   //     return;
//   //   }
//   //     console.log('Connected to MYSQL database');
//   //     console.log("connected as id " + sqlConnect.threadId);
//   // });
//   // return sqlConnect;
//   // const connection = await pool.getConnection(); // Get a connection from the pool
//   //   try {
//   //       const [results] = await connection.execute(query, params);
//   //       return results;
//   //   } finally {
//   //       connection.release(); // Release the connection back to the pool
//   //   }

// };

//let connectSqlDb =  mysql_db;

export {pool};
