const express = require('express');
const BlogPost = require('../models/BlogPost');
const router = express.Router();

// Create a new post
router.post('/add', async (req, res) => {
    const { title, content } = req.body;
    try {
        const newPost = new BlogPost({ title, content });
        await newPost.save();
        res.json(newPost);
    } catch (err) {
        res.status(400).send('Error creating post');
    }
});

// Read all posts
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.json(posts);
    } catch (err) {
        res.status(400).send('Error fetching posts');
    }
});

// Update a post
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).send('Error updating post');
    }
});

// Update a post
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true } // Returns the updated post
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(400).send('Error updating post');
    }
});


// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(400).send('Error deleting post');
    }
});

module.exports = router;
