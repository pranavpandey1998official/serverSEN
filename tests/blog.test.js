const request = require('supertest');
const {app, server} = require('./../app');

test('should fetch all blogs', (done) => {
    request(app)
        .get('/blogs/')
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done);
})

test('should add a valid blog', (done) => {
    var userId = 1;
    var postUserId = 1;
    var blog = "TEST BLOG"

    var blog_data = {userId, postUserId, blog}

    request(app)
        .post('/blogs/')
        .send(blog_data)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true)
        })
        .end(done);
})

test('should raise authorisation error for userid != postUserId', (done) => {
    var userId = 1;
    var postUserId = 1;
    var blog = "TEST BLOG"

    var blog_data = {userId, postUserId, blog}

    request(app)
    .post('/blogs/')
    .send(blog_data)
    .expect(401)
    .expect((res) => {
        expect(res.body.error).toBe(true)
        expect(res.body.message).toBe("Not authorised to perform this operation");
    })
    .end(done)
})

test('should edit a blog', (done) => {
    var updatedBlog = "UPDATED BLOG"
    var blogId = 1;

    var blog_data = {blogId, updatedBlog}

    request(app)
        .put('/blogs/')
        .send(blog_data)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done)
})

test('should reise an error for non existant blog'), (done) => {
    var updatedBlog = "UPDATED BLOG"
    var blogId = 1;

    var blog_data = {blogId, updatedBlog}

    request(app)
        .put('/blogs/')
        .send(blog_data)
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("review does not exist");
        })
        .end(done);
})

test('should delete a blog', (done) => {
    var blogId = 1;

    var blog_data = {blogId}

    request(app)
        .delete('/blogs/')
        .send(blog_data)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done)
})

test('should raise error for delete request of non existant blog', (done) => {
    var blogId = 1;
    var blog_data = {blogId}

    request(app)
        .delete('/blogs/')
        .send(blog_data)
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("review does not exist")
        })
        .end(done)
})

