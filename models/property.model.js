const connection = require('../connections/mysql_db');

const getAllProperty =  () => {
    let query = {
        sql: `SELECT p.*, i.imagePath FROM property as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1`
    };
    return new Promise(function(res, rej) {
        connection.query(query, (err, result) => {
            console.log(result);
            if(err) throw rej(err);
            else return res(result);
        });
    })
};

const getPropertyById = async (propertyId) => {
    let query = {
        sql: `SELECT * FROM property as p
              WHERE propertyId = ?`,
        values: [propertyId]      
    };

    connection.query(query, (err, result) => {
        if(err) throw err;
        else {
            let query = {
                sql: `SELECT * FROM property_photos as p
                      WHERE propertyId = ?`,
                values: [propertyId]   
            };

            connection.query(query, (err2, result2) => {
                if(err) throw err;
                else {
                    result[0].images = result2;
                    return result;
                }
            })
        }
    });
};

const getFilteredProperty = async (p) => {
    let query = {
        sql: `SELECT p.*, i.imagePath FROM property as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1 AND
              p.noOfBedrooms = ? AND
              p.noOfBathrooms = ? AND
              p.noOfBalconies = ? AND
              p.price IN BETWEEN ? AND ? AND
              p.totalSqft IN BETWEEN ? AND ?`,
        values: [p.noOfBedrooms, p.noOfBathrooms, p.noOfBalconies, p.price.min, p.price.max, p.totalSqft.min, p.totalSqft.max]
    };

    if(p.gym == true) query.sql + " AND p.distanceToNearestGym < 2.5";
    if(p.bath == true) query.sql + " AND p.distanceToNearestSchool < 2.5";
    if(p.hosp == true) query.sql + " AND p.distanceToNearestHospital < 2.5";

    connection.query(query, (err, result) => {
        if(err) throw err;
        else return result;
    })

} 

module.exports = {
    getAllProperty,
    getFilteredProperty,
    getPropertyById
};
