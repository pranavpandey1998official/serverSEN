const connection = require('../connections/mysql_db');

const getWishlist = (userId) => {
    let query = {
        sql: `select * from wishlist as w
              natural join property 
              where w.userId = ?`,
        values: [userId]      
    };

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if(err) {
                console.log(err);
                reject(err);}
            else resolve(result);
        });
    });
}

const addToWishlist = (body) => {
    let query = {
        sql: `insert into wishlist set ?`,
        values: [body]
    };

    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve();
        })
    });
};

const deleteFromWishlist = (userId, propertId) => {
    let query = {
        sql:"delete from wishlist where userId = ? and propertyId = ?",
        values: [userId, propertId]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
};

const getWishlistForUser = (propertyId, userId) => {
    let query = {
        sql: `select * from wishlist
              where userId = ? and propertyId = ?`,
        values: [userId, propertyId]     
    };

    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}

module.exports = {
    getWishlist,
    addToWishlist,
    deleteFromWishlist,
    getWishlistForUser
};