//para rutas que necesiten qie el usuario este autenticado
require ('dotenv').config(); //para cargar las variables de entorno del archivo .env
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const secretKey = process.env.JWT_SECRET_KEY;
    jwt.verify (token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });   
};

module.exports = authenticateToken;