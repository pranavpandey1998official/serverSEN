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
            // console.log("add" + (JSON.stringify(result)));
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
            // console.log(result);
            if(err) reject(err);
            else resolve(result);
        })
    })
};

// const getWishlistFromPropertyId = (propertyId, userId) => {
//     let query = {
//         sql: "select * from wishlist where propertyId = ? and userId = ?",
//         values: [propertyId, userId]
//     }

//     return new Promise(function(resolve, reject) {
//         connection.query(query, (err, result) => {
//             if(err) reject(err);
//             else {
//                 if(result.length == 0) reject({err: "no such wishlist found"});
//                 else resolve(result[0]);
//             }
//         });
//     });
// }

module.exports = {
    getWishlist,
    addToWishlist,
    // getWishlistFromPropertyId
    deleteFromWishlist
};