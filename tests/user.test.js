jest.mock('./../services/mailSender');

const request = require('supertest');
// const expect = require('expect');

const {app} = require('./../app');
const User = require("../models/user.model");



var email = 'alice@example.com';
var password = 'alicepasswd';
var firstName = 'alice';
var lastName = 'green';

var userData = {
    email, 
    password,
    firstName,
    lastName
};


User.removeUser(email);

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

                        // Test for invalid email signup
                        // var invalid_email = "this is an invalid email";
                        // userData.email = invalid_email;
                        // test('should block a sign up request for invalid emails', (done) =>{
                        //     request(app)
                        //         .post('/auth/signup')
                        //         .send(userData)

                        // })

signInData = {email, password}
test('should block sign in of non-verified user', (done) => {
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






var janeEmail = 'jane@gmail.com'
signInData = {janeEmail, password: 'wrongpassword'};
test('should block sign in for wrong password provided', (done) => {
    request(app)
        .post('/auth/signin')
        .send(signInData)
        .expect(401)
        .expect((res) => {
            expect(res.body.message).toBe("Auth failed!..");
        })
});



test('should allow valid login and return a valid token', (done) => {
    request(app)
        .post('/auth/signin')
        .send({
            email: 'alice@gmail.com',
            password: 'alice'
        })
        .expect(200)
});





