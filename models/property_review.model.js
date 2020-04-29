const connection = require('../connections/mysql_db');

const getAllReviews = (propertId) => {
    const query = {
        sql: `select r.*, u.firstName, u.lastName from review as r
              natural join users as u
              where r.propertyId = ?`,
        values: [propertId]
    };

    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};

const addReview = (review) => {
    const query = {
        sql: "insert into review set ?",
        values: [review]
    };

    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result.insertId);
        })
    });
}

const editReview  = (reviewText, reviewId) => {
    let query = {
        sql:"update review set reviewText = ? where reviewId = ?",
        values: [reviewText, reviewId]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }) 
};

const deleteReview = (reviewId) => {
    let query = {
        sql:"delete from review where reviewId = ?",
        values: [reviewId]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
    
};

const getReviewById = (reviewId) => {
    const query = {
        sql: "select * from review where reviewId = ?",
        values: [reviewId]
    };

    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else {
                if(result.length == 0) reject({err: "no such review found"});
                else resolve(result[0]);
            }
        });
    });
}

module.exports = {
    getAllReviews,
    addReview,
    editReview,
    deleteReview,
    getReviewById
};