jest.mock('./../services/mailSender');

const request = require('supertest');
const {app} = require('./../app');
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

var email = 'alice@example.com';
var password = 'alicepasswd';
var firstName = 'alice';
var lastName = 'green';
var saltRounds = 10;

var userData = {
    email, 
    password,
    firstName,
    lastName
};


beforeAll(() => {
    User.removeUser(email).then({
    })
    .catch((e) => {
        console.log(e);
    })
});

var signInData = {email, password};
test('should block sign in for wrong email', (done) => {
    request(app)
        .post('/auth/signin')
        .send(signInData)
        .expect(401)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("either email or password is wrong");
        })
        .end(done)
});

test('should create a user in db on valid sign up request', (done) => {
    request(app)
    .post('/auth/signup')
    .send(userData)
    .expect(201)
    .expect((res) => {
        expect(res.body.message).toBe('User Created Successfully');
    })
    .end(done)
});

test('should block a sign up for existing email', (done) => {
    userData = {
        email: 'alice@gmail.com',
        password,
        firstName,
        lastName
    }
    request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(402)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("email already exists");
        })
        .end(done)
});

//                         // Test for invalid email signup
//                         // var invalid_email = "this is an invalid email";
//                         // userData.email = invalid_email;
//                         // test('should block a sign up request for invalid emails', (done) =>{
//                         //     request(app)
//                         //         .post('/auth/signup')
//                         //         .send(userData)

//                         // })

test('should block sign in of non-verified user', (done) => {
    signInData = {
        email: 'jane@gmail.com',
        password: 'alice'
    }
    request(app)
        .post('/auth/signin')
        .send(signInData)
        .expect(401)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("Email not verified");
        })
        .end(done)
});

test('should block sign in for wrong password provided', (done) => {
    signInData = {
        email: 'alice@gmail.com',
        password: 'wrongpassword'
    }
    request(app)
        .post('/auth/signin')
        .send(signInData)
        .expect(400)
        .expect((res) => {
            expect(res.body.message).toBe("Email and password combination is wrong");
        })
        .end(done)
});


test('should sign the user in and return token for correct credentials', (done) => {
    signInData = {
        email: 'alice@gmail.com',
        password: 'alice'
    }
    request(app)
        .post('/auth/signin')
        .send(signInData)
        .expect(200)
        .expect((res) => {
            expect(res.body.message).toBe("Successful Authentication");
            expect(res.body.token).toBeTruthy();
            expect(res.body.user.email).toBe("alice@gmail.com");
            expect(res.body.user.firstName).toBe("alice");
            expect(res.body.user.lastName).toBe("green");
        })
        .end(done)
});

test('should block signInViaToken for NULL token', (done) => {
    request(app)
        .post('/auth/signinToken')
        .send({})
        .expect(500)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("Token Not Provided");
        })
        .end(done)
});

test('should sign in the user if correct token is provided', (done) => {
    signInData = {
        email: 'alice@gmail.com',
        password: 'alice'
    }
    
    request(app)
        .post('/auth/signin')
        .send(signInData)
        .expect(200)
        .expect((res) => {
            expect(res.body.token).toBeTruthy();
            request(app)
                .post('/auth/signinToken')
                .send({token: res.body.token})
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe("Successful Authentication");
                    expect(res.body.token).toBe(token);
                    expect(res.body.user.firstName).toBe('alice');
                    expect(res.body.user.email).toBe('alice@gmail.com');
                    expect(res.body.user.lastName).toBe('green');
                })
        })
        .end(done)
});

test('should block signin for invalid token provided', (done) => {
    var token = "dfrgthciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1MiwiaWF0IjoxNTg2MTYyMTgxLCJleHAiOjE1ODYxODAxODF9.orF2JsIKN_-w89S8fyw3m27u2-O6kJcwNYjLd_n8__0";
    request(app)
        .post('/auth/signinToken')
        .send({token})
        .expect(402)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("Invalid token provided");
        })
        .end(done);
});


// // Yet to test
// Reset password
// Verify user via token