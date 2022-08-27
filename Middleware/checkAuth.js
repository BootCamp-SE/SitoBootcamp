const JWT = require('jsonwebtoken');
const User = require('../Models/user');

const checkUser =  (req, res, next) => {
    const token = req.cookies.JWT;
    
    if (token) {
        JWT.verify(token, process.env.JWT_SECRET, async (err, decodeToken) => {
            if (err) {
                res.locals.auth = false;
                res.locals.user = null;
                next();
            } else {
                res.locals.auth = true;
                const user = await User.findById(decodeToken.id);
                res.locals.user = user.username;
                next();
            }
        });
    } else {
        res.locals.auth = false;
        res.locals.user = null;
        next();
    }

};

module.exports = {
    checkUser,
}