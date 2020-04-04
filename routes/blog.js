const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.model');
const checkAuth = require('../middlewares/check-auth');

const getAllBlogs = (req, res, next) => {
    Blog.getBlogs().then(blogs => {
        res.status(200).json({
            success: true,
            blogs: blogs
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    })   
}

const addBlog = async (req, res, next) => {
    const newBlog = req.body.blog;
    try {
        const blogId = await Blog.addBlog(newBlog);
        res.status(201).json({
            success: true,
            blogId: blogId
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
          });
    }  
}

const updateBlog = async (req, res, next) => {
    const updatedBlog = req.body.updatedBlog;
    const blogId = req.params.blogId;
    try {
        await Blog.editBlog(updatedBlog, blogId);
        res.status(201).json({
            success: true
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
        });
    }  
}

const deleteBlog = async (req, res, next) => {
    const blogId = req.params.blogId;
    try {
        await Blog.deleteBlog(blogId);
        res.status(201).json({
            success: true
        });
    }catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
            })
    }   
}

const checkAuthor = async (req, res, next) => {
    const userId = req.userId;
    const blogId = req.params.blogId;
    try {
        const blog = await Blog.getBlogById(blogId);
        if(blog.length == 0 || blog[0].userId != userId) {
            return res.status(400).json({
                error: true,
                message: "Not authorised to perform this operation"
            })
        }
        next();
    }catch (e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    }
}

router.get("" , getAllBlogs);
router.post("", checkAuth, addBlog);
router.put("/:blogId", checkAuth, checkAuthor, updateBlog);
router.delete("/:blogId", checkAuth, checkAuthor, deleteBlog);

module.exports = router;
