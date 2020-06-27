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
      const resp = await User.findUser(email);

      if(resp.length == 0) {
        return res.status(401).json({
          error: true,
          message: "either email or password is wrong"
        })
      }

      const user = resp[0];

      if(!user.is_verified) {
        return res.status(401).json({
          error: true,
          message: "Email not verified"
        })
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if(err){
          reject('Auth failed!..')
        }
        if (!result) {
          return res.status(400).json({ message: "Email and password combination is wrong", error: true });
        }
        else{
          const {userId, email, firstName, lastName } = user;
          const token = jwt.sign({userId},process.env.SECRET_KEY, { expiresIn: "5h"})
          return res.status(200).json({
            message: "Successful Authentication",
            token,
            user: {
              userId,
              email,
              firstName,
              lastName
            }
          })
        }
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
    return res.set('Location','https://naughty-goodall-3caf39.netlify.com/info/emailVerified' ).status(301).json({
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
  const { email, password, firstName, lastName } = req.body;

  try {
    let user = await User.findUser(email);

    if(user.length != 0) {
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
        User.createUser(email,hash,firstName,lastName).then((userId)  => {
          sendConfirmationMail(userId, email, firstName);
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
    const resp = await User.findUser(email);
    if(resp.length == 0) {
      return res.status(401).json({
        error: true,
        message: "Error email not registered"
      })
    }

    const user = resp[0];
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
        message: "Database error! please try again later."
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
  try {
    const decyptToken = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decyptToken;
    let resp = await User.findUserViaId(userId);
    
    if(resp.length == 0) {
      return res.status(402).json({
        error: true,
        message: "No such user exists"
      })
    }
    const user = resp[0];
    const { email, firstName, lastName } = user;
    return res.status(200).json({
      message: "Successful Authentication",
      token,
      user: {
        userId,
        email,
        firstName,
        lastName
      }
    })

  }catch(e) {
    console.log(e)
    return res.status(402).json({
      error: true, 
      message: "Invalid token provided"
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