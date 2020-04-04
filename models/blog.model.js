const connection = require('../connections/mysql_db');

const getBlogs = async () => {
    let query = {
        sql: "select * from blogs"
    };
    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
    
    
};

const addBlog = async (blog) => {
    let query = {
        sql: "insert into blogs set ?",
        values: [blog]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result.insertId);
        })
    })
    
    
};

const editBlog  = async (blog, blogId) => {
    let query = {
        sql:"update blogs set ? where blogId = ?",
        values: [blog, blogId]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve();
        })
    })
    
};

const deleteBlog = async (blogId) => {
    let query = {
        sql:"delete from blogs where blogId = ?",
        values: [blogId]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve();
        })
    })
    
};

const getBlogById = async (blogId) => {
    let query = {
        sql: "select * from blogs where blogId = ?",
        values: [blogId]
    };

    return new Promise(function(resolve, reject){
        connection.query(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
    
    
};

module.exports = {
    getBlogs,
    addBlog,
    editBlog,
    deleteBlog,
    getBlogById
};