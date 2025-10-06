const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Our authentication middleware
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      author: req.user.id,
    });

    const post = await newPost.save();
    // Manually populate author details for immediate response
    const populatedPost = await post.populate('author', ['name']);
    res.status(201).json(populatedPost);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['name']) // Replace author ObjectId with their name
      .sort({ createdAt: -1 }); // Show newest posts first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        // Check if the user deleting the post is the author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.deleteOne();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/posts/:id
// @desc    Update a post
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.content = req.body.content;
        await post.save();
        const populatedPost = await post.populate('author', ['name']);
        res.json(populatedPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;