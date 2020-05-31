const request = require('supertest');
const {app, server} = require('./../app');

test('should fetch the reviews for given property', (done) => {
    var prop_id = 1;
    request(app)
        .get('/property_review/' + prop_id)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done);
})

test('should add a valid review', (done) => {
    var userId = 1;
    var postUserId = 1;
    var review = "TEST REVIEW"

    var review_data = {userId, postUserId, review}

    request(app)
        .post('/property_review/')
        .send(review_data)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true)
        })
        .end(done);
})

test('should raise authorisation error for userid != postUserId', (done) => {
    var userId = 1;
    var postUserId = 1;
    var review = "TEST REVIEW"

    var review_data = {userId, postUserId, review}

    request(app)
    .post('/property_review/')
    .send(review_data)
    .expect(401)
    .expect((res) => {
        expect(res.body.error).toBe(true)
        expect(res.body.message).toBe("Not authorised to perform this operation");
    })
    .end(done)
})

test('should edit a review', (done) => {
    var updatedReviewText = "UPDATED REVIEW";
    var reviewId = 1;

    var review_data = {updatedReviewText, reviewId};

    request(app)
        .put('/property_review/')
        .send(review_data)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done)
})

test('should reise an error for non existant review'), (done) => {
    var updatedReviewText = "UPDATED REVIEW";
    var reviewId = 2;

    var review_data = {updatedReviewText, reviewId};

    request(app)
        .put('/property_review/')
        .send(review_data)
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("review does not exist");
        })
        .end(done);
})

test('should delete a review', (done) => {
    var reviewId = 1;

    var review_data = {reviewId}

    request(app)
        .delete('/property_review/')
        .send(review_data)
        .expect(200)
        .expect((res) => {
            expect(res.body.success).toBe(true);
        })
        .end(done)
})

test('should raise error for delete request of non existant review', (done) => {
    var reviewId = 1;
    var review_data = {reviewId}

    request(app)
        .delete('/property_review/')
        .send(review_data)
        .expect(400)
        .expect((res) => {
            expect(res.body.error).toBe(true);
            expect(res.body.message).toBe("review does not exist")
        })
        .end(done)
})

