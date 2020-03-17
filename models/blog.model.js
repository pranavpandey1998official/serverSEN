const connection = require('../connections/mysql_db');

const getBlogs = async () => {
    let query = {
        sql: "select * from blogs"
    };

    connection.query(query, (err, result) => {
        if(err) throw err;
        else return result;
    })
    
};

const addBlog = async (blog) => {
    let query = {
        sql: "insert into blogs set ?",
        values: [blog]
    };

    connection.query(query, (err, result) => {
        if(err) throw err;
        else return result.insertId;
    })
    
};

const editBlog  = async (blog, blogId) => {
    let query = {
        sql:"update blogs set ? where blogId = ?",
        values: [blog, blogId]
    };
    connection.query(query, (err, result) => {
        if(err) throw err;
        else return;
    })
};

const deleteBlog = async (blogId) => {
    let query = {
        sql:"delete from blogs where blogId = ?",
        values: [blogId]
    };

    connection.query(query, (err, result) => {
        if(err) throw err;
        else return;
    })
};

const getBlogById = async (blogId) => {
    let query = {
        sql: "select * from blogs where blogId = ?",
        values: [blogId]
    };
    connection.query(query, (err, result) => {
        if(err) throw err;
        else return result;
    })
    
};

module.exports = {
    getBlogs,
    addBlog,
    editBlog,
    deleteBlog,
    getBlogById
};