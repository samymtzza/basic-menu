const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'restaurant_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.query("SELECT 1 + 1 AS result", function(err, results) {
    if(err) {
        console.log("Error conectando a la base de datos:", err);
    } else {
        console.log("Conexión exitosa! Resultado:", results[0].result);
    }
});

module.exports = pool.promise();