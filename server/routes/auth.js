const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route  POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, username } = req.body;
  try {
    const emailExists    = await User.findOne({ where: { email } });
    const usernameExists = await User.findOne({ where: { username } });

    if (emailExists)    return res.status(400).json({ message: 'User already exists' });
    if (usernameExists) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({ name, email, password, username });

    res.status(201).json({
      _id:      user.id,
      name:     user.name,
      email:    user.email,
      username: user.username,
      token:    generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id:      user.id,
        name:     user.name,
        email:    user.email,
        username: user.username,
        token:    generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
