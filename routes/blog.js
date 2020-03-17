const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.model');
const checkAuth = require('../middlewares/check-auth');

const getAllBlogs = async (req, res, next) => {
    Blog.getBlogs().then(blogs => {
        res.status(200).json({
            success: true,
            blogs: blogs
        });
    }).catch(err => {
        res.status(500).json({
            error: true, 
            message: "Database error. Failed to create a user"
          })
    })   
}

const addBlog = async (req, res, next) => {
    const newBlog = req.body.updatedBlog;
    const blogId = req.params.blogId;
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
            message: "Database error. Failed to create a user"
          })
    }  
}

const updateBlog = async (req, res, next) => {
    const updatedBlog = req.body.updatedBlog;
    const blogId = req.params.blogId;
    const uesrId = req.body.userId;
    checkBlogAndUser(blogId, userId)
    .then(async (v) => {
        try {
            await Blog.editBlog(updateBlog, blogId);
            res.status(201).json({
                success: true
            });
        }catch(e) {
            console.log(e);
            res.status(500).json({
                error: true, 
                message: "Database error. Failed to create a user"
              })
        }  
    }).catch(e => {
        res.status(401).json({
            error: true, 
            message: "Not authorised to update"
          })
    })
    
}

const deleteBlog = async (req, res, next) => {
    const blogId = req.params.blogId;
    const uesrId = req.body.userId;
    checkBlogAndUser(blogId, userId)
    .then(async (v) => {
        try {
            await Blog.deleteBlog(blogId);
            res.status(201).json({
                success: true
            });
        }catch(e) {
            console.log(e);
            res.status(500).json({
                error: true, 
                message: "Database error. Failed to create a user"
              })
        }   
    }).catch(e => {
        res.status(401).json({
            error: true, 
            message: "Not authorised to update"
          })
    })
    
    
}

const checkBlogAndUser = async (blogId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blog = await Blog.getBlogById(blogId);
            if(blog!=null && blog[0].userId == userId) resolve(true);
            else reject(true);
        }catch (e) {
            console.log(e);
            throw e;
        }
    })
}

router.get("" , getAllBlogs);
router.post("", checkAuth, addBlog);
router.put("/:blogId", checkAuth, updateBlog);
router.delete("/:blogId", checkAuth, deleteBlog);

module.exports = router;
