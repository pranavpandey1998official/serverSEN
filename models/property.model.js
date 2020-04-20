const connection = require('../connections/mysql_db');

const getAllProperty =  () => {
    let query = {
        sql: `SELECT p.*, i.imagePath FROM property as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1`
    };
    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    })
};

const getPropertyById = (propertyId) => {
    let query = {
        sql: `SELECT * FROM property as p
              WHERE propertyId = ?`,
        values: [propertyId]      
    };
    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) throw reject(err);
            else {
                if(result.length == 0) reject({err: "no such property found"});
                else {
                    let query = {
                        sql: `SELECT imagePath, photoId FROM property_photos as p
                              WHERE propertyId = ?`,
                        values: [propertyId]   
                    };
        
                    connection.query(query, (err2, result2) => {
                        if(err) reject(err2);
                        else {
                            result[0].images = result2;
                            resolve(result);
                        }
                    })
                }
                
            }
        });
    })
   
};

const getFilteredProperty = (p) => {
    console.log(p)
    let query = {
        sql: `SELECT p.*, i.imagePath FROM property as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1`
    };
    if(p.price) query.sql += ` AND p.price BETWEEN ${Number(p.price.min)} AND ${Number(p.price.max)} `;
    if(p.totalSqft) query.sql += ` AND p.totalSqft BETWEEN ${p.totalSqft.min} AND ${p.totalSqft.max} `;
    if(p.isGym) query.sql += " AND p.distanceToNearestGym < 2.5 ";
    if(p.isSchool) query.sql += " AND p.distanceToNearestSchool < 2.5 ";
    if(p.isHospital) query.sql += " AND p.distanceToNearestHospital < 2.5 ";
    if(p.noOfBalconies) query.sql += ` AND p.noOfBalconies = ${p.pricenoOfBalconies} `;
    if(p.noOfBathrooms) query.sql += ` AND p.noOfBathrooms = ${p.noOfBathrooms} `;
    if(p.noOfBedrooms) query.sql += ` AND p.noOfBedrooms = ${p.noOfBedrooms} `;
    console.log(query.sql);

    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) reject(err); 
            else resolve(result);
        })
    })
};

module.exports = {
    getAllProperty,
    getFilteredProperty,
    getPropertyById
};
