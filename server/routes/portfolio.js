const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get current user's portfolio
// @route   GET /api/portfolio/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update portfolio
// @route   POST /api/portfolio
// @access  Private
router.post('/', protect, async (req, res) => {
  const {
    templateId,
    personalInfo,
    education,
    skills,
    projects,
    experience,
    certifications,
    socialLinks,
    settings,
  } = req.body;

  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (portfolio) {
      // Update
      portfolio.templateId = templateId || portfolio.templateId;
      portfolio.personalInfo = personalInfo || portfolio.personalInfo;
      portfolio.education = education || portfolio.education;
      portfolio.skills = skills || portfolio.skills;
      portfolio.projects = projects || portfolio.projects;
      portfolio.experience = experience || portfolio.experience;
      portfolio.certifications = certifications || portfolio.certifications;
      portfolio.socialLinks = socialLinks || portfolio.socialLinks;
      portfolio.settings = settings || portfolio.settings;

      const updatedPortfolio = await portfolio.save();
      res.json(updatedPortfolio);
    } else {
      // Create
      const newPortfolio = new Portfolio({
        userId: req.user._id,
        templateId,
        personalInfo,
        education,
        skills,
        projects,
        experience,
        certifications,
        socialLinks,
        settings,
      });

      const createdPortfolio = await newPortfolio.save();
      res.status(201).json(createdPortfolio);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get public portfolio by username
// @route   GET /api/portfolio/public/:username
// @access  Public
router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (user) {
      const portfolio = await Portfolio.findOne({ userId: user._id });

      if (portfolio && portfolio.settings.isPublic) {
        res.json({
          user: {
            name: user.name,
            username: user.username,
          },
          portfolio,
        });
      } else {
        res.status(404).json({ message: 'Portfolio is private or not found' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
