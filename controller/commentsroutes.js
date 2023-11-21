const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Reply = require('../models/Reply');

// POST a new comment
router.post('/get-comment', async (req, res) => {
  try {
    const { author, content } = req.body;
    const newComment = new Comment({ author, content });
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all comments
router.get('/get-comment', async (req, res) => {
  try {
    const comments = await Comment.find().populate('replies');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new reply for a comment
router.post('/get-reply/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { author, content } = req.body;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const newReply = new Reply({ author, content });
    const savedReply = await newReply.save();

    comment.replies.push(savedReply);
    await comment.save();

    res.json(savedReply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
