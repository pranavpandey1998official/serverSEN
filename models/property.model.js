const connection = require('../connections/mysql_db');

const getAllProperty = async () => {
    let query = {
        sql: `SELECT p.*, i.imagePath FROM proprty as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1`
    };

    connection.query(query, (err, result) => {
        if(err) throw err;
        else return result.asPromise();
    });
};

const getPropertyById = async (propertyId) => {
    let query = {
        sql: `SELECT * FROM proprty as p
              WHERE proprtyId = ?`,
        values: [propertyId]      
    };

    connection.query(query, (err, result) => {
        if(err) throw err;
        else {
            let query = {
                sql: `SELECT * FROM proprty_photos as p
                      WHERE proprtyId = ?`,
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
        sql: `SELECT p.*, i.imagePath FROM proprty as p
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
