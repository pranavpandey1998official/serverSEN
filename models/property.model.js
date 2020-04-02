const connection = require('../connections/mysql_db');

const getAllProperty =  () => {
    let query = {
        sql: `SELECT p.*, i.imagePath FROM property as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1`
    };
    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            console.log(result);
            if(err) reject(err);
            else resolve(result);
        });
    })
};

const getPropertyById = async (propertyId) => {
    let query = {
        sql: `SELECT * FROM property as p
              WHERE propertyId = ?`,
        values: [propertyId]      
    };
    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err) throw reject(err);
            else {
                let query = {
                    sql: `SELECT imagePath, photoId FROM property_photos as p
                          WHERE propertyId = ?`,
                    values: [propertyId]   
                };
    
                connection.query(query, (err2, result2) => {
                    // console.log(result2);
                    if(err) reject(err2);
                    else {
                        result[0].images = result2;
                        resolve(result);
                    }
                })
            }
        });
    })
   
};

const getFilteredProperty = async (p) => {
    console.log(p);
    let query = {
        sql: `SELECT p.*, i.imagePath FROM property as p
              NATURAL JOIN property_photos as i
              WHERE i.photoId = 1 AND
              p.price BETWEEN ? AND ? 
              AND p.totalSqft BETWEEN ? AND ?`,
        values: [Number(p.price.min), Number(p.price.max), p.totalSqft.min, p.totalSqft.max]
    };

    if(p.gym) query.sql + " AND p.distanceToNearestGym < 2.5";
    if(p.bath) query.sql + " AND p.distanceToNearestSchool < 2.5";
    if(p.hosp) query.sql + " AND p.distanceToNearestHospital < 2.5";
    if(p.noOfBalconies) query.sql + `AND p.noOfBalconies = ${noOfBalconies}`;
    if(p.noOfBathrooms) query.sql + `AND p.noOfBathrooms = ${noOfBathrooms}`;
    if(p.noOfBedrooms) query.sql + `AND p.noOfBedrooms = ${noOfBedrooms}`;

    console.log(query);

    return new Promise(function(resolve, reject) {
        connection.query(query, (err, result) => {
            if(err){
                
                reject(err);
            } 
            else resolve(result);
        })
    })
    

} 

module.exports = {
    getAllProperty,
    getFilteredProperty,
    getPropertyById
};
