require ('dotenv').config(); //para cargar las variables de entorno del archivo .env
const mysql = require('mysql2');

//En lugar de abrir y cerrar una conexión individual cada vez que se necesita interactuar se reutiliza
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();