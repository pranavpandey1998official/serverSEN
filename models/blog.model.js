const connection = require('../connections/mysql_db');

const getBlogs = async () => {
    let query = {
        sql: "select * from blogs"
    };
    try {
        const result = await connection.query(query);
        return result;
    }catch(err) {
        console.log(err);
        throw err;
    }
    
};

const addBlog = async (blog) => {
    let query = {
        sql: "insert into blogs set ?",
        values: [blog]
    };

    try {
        const result = await connection.query(query);
        return result.insertId;
    }catch(err) {
        console.log(err);
        throw err;
    }
    
};

const editBlog  = async (blog, blogId) => {
    let query = {
        sql:"update blogs set ? where blogId = ?",
        values: [blog, blogId]
    };
    try {
        await connection.query(query);
    }catch(err) {
        throw err;
    }
};

const deleteBlog = async (blogId) => {
    let query = {
        sql:"delete from blogs where blogId = ?",
        values: [blogId]
    };

    try {
        await connection.query(query);
    }catch(err) {
        throw err;
    }
};

const getBlogById = async (blogId) => {
    let query = {
        sql: "select * from blogs where blogId = ?",
        values: [blogId]
    };
    try {
        const result = await connection.query(query);
        return result;
    }catch(err) {
        console.log(err);
        throw err;
    }
    
};

module.exports = {
    getBlogs,
    addBlog,
    editBlog,
    deleteBlog,
    getBlogById
};