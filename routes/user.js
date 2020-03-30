const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");

const {
  sendConfirmationMail,
  sendPasswordResetMail
} = require("../services/mailSender");

const saltRounds = 10;

const signIn = async(req, res) => {
    const { email, password } = req.body
    try {
      const users = await User.findUser(email);
      const user=users[0]
      if(!user) {
        return res.status(401).json({
          error: true,
          message: "either email or password is wrong"
        })
      }
      if(!user.is_verified) {
        return res.status(401).json({
          error: true,
          message: "Email not verified"
        })
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Auth failed!.." });
        }
        if(result) {
          const {userId, email, firstName, lastName } = user;
          const token = jwt.sign({userId},process.env.SECRET_KEY, { expiresIn: "5h"})
          return res.status(200).json({
            message: "Successful Authentication",
            token,
            user: {
              email,
              firstName,
              lastName
            }
          })
        }
        return res.status(400).json({ message: "Email and password combination is wrong", error: true });
      })
    }catch(e) {
      res.status(500).json({
        message: "something went wrong please try again",
        error: true,
      })
    }
};

const userVerification = async(req, res) => {
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { userId } = user;

  try {
    await User.setEmailVerified(userId);
    return res.set('Location','/info/emailVerified' ).status(301).json({
      message: "user verified successfully"
    })
  } catch(e) {
    res.status(500).json({
      error: true,
      message: "Error verifying user"
    })
  }
  
};

/* response object should have following parameter
  email
  password
  first name
  last name
*/

const signUp = async(req, res) => {
  console.log(req.body);
  const { email, password, firstName, lastName } = req.body.userData;

  try {
    user = await User.findUser(email);
    console.log("user: "+user);
    if(user!=null && user[0].is_verified) {
      return res.status(402).json({
        error: true,
        message: "email already exists"
      })
    }
  }catch(e) {
    console.log(e)
    return res.status(500).json({
      error: true, 
      message: "Database error. Failed to create a user"
    })
  }
  bcrypt.genSalt(saltRounds, function(err, salt) {
     bcrypt.hash(password, salt, (err, hash) => {
        User.createUser(email,hash,firstName,lastName).then((user)  => {
          sendConfirmationMail(user.userId, user.email, user.firstName);
          return res.status(201).json({
            message: 'User Created Successfully'
          })
        }
        ).catch((e) => res.status(500).json({
          error: true, 
          message: "Database error. Failed to create a user"
        })
        )
    })
  });
  
};

const sendPasswordResetLink = async(req, res) => {
  const { email } = req.body;
  try {
    const users = await User.findUser(email);
    const user=users[0]
    if(!user) {
      return res.status(401).json({
        error: true,
        message: "Error email not registered"
      })
    }
    if(!user.is_verified) {
      return res.status(401).json({
        error: true,
        message: "Email not verified"
      });
    }
    sendPasswordResetMail(email, user.userId);
    res.status(200).json({ message: "Reset link send to your email" });
  } catch(e) {
    res.status(500).json({
      error: true,
      message: "Error verifying user"
    });
  }
};

const resetPassword = (req, res) => {
  const { password } = req.body;
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { userId } = user;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
      User.resetPassword(userId,hash).then(()  => {
        return res.status(201).json({
          message: 'Password Reset Successfully'
        })
      }).catch((e) => res.status(500).json({
        error: true, 
        message: "Database error. Failed to create a user"
      })
      )
    });
  });
};

const signInViaToken = async(req, res) => {
  const { token } = req.body;
  if(!token) {
    return res.status(500).json({
      error: true, 
      message: "Token Not Provided"
    })
  }
  const decyptToken = jwt.verify(token, process.env.SECRET_KEY);
  try {
    const { userId } = decyptToken;
    users = await User.findUserViaId(userId);
    const user=users.rows[0]
    if(!user) {
      return res.status(402).json({
        error: true,
        message: "email already exists"
      })
    }
    const { email, firstName, lastName } = user;
    return res.status(200).json({
      message: "Successful Authentication",
      token,
      user: {
        email,
        firstName,
        lastName
      }
    })

  }catch(e) {
    console.log(e)
    return res.status(500).json({
      error: true, 
      message: "Database error. Failed to create a user"
    })
  }
}

const router = express.Router();

router.get("/:token", userVerification);
router.post("/signin", signIn);
router.post("/signinToken", signInViaToken)
router.post("/signup", signUp);
router.post("/reset-password", sendPasswordResetLink);
router.post("/reset-password/:token", resetPassword);

module.exports = router;