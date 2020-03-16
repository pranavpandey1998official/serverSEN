const jwt = require('jsonwebtoken');

//For checking if a user is Authenticated (having a valid Token)

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err) {
            console.log(err);
            res.status(401).json({ message: "Auth failed!" });
        }else {
            req.body.userId = decoded;
            next();
        }
    });
}