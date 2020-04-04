const jwt = require('jsonwebtoken');

//For checking if a user is Authenticated (having a valid Token)

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err) {
            console.log(err);
            return res.status(401).json({ message: "Auth failed!" });
        }
        const { userId } = decoded;
        req.userId = userId;
        next();
    });
}