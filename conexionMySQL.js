const mysql = require('mysql2/promise');

async function connectDatabase(host,user,password,database) {
  const connection = await mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
  });

 // console.log('Conexión exitosa a la base de datos MySQL');

  return connection;
}

module.exports = connectDatabase;
