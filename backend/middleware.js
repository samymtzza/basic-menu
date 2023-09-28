// backend/middleware.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    
    if (!bearerHeader) {
        return res.status(403).send({ message: "No token provided!" });
    }

    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, 'super_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = {
    verifyToken
};
