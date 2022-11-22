import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('forbidden');
        }
        req.user = user;
        // setTimeout(() => {
        next();
        // }, 1000);
    });
};

export default authenticateToken;
