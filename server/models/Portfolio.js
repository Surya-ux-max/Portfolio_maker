const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    templateId: {
      type: String,
      default: 'modern',
    },
    personalInfo: {
      name: String,
      bio: String,
      role: String,
      profilePhoto: String,
      email: String,
      phone: String,
      location: String,
    },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        description: String,
      },
    ],
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Beginner',
        },
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        githubLink: String,
        liveLink: String,
        image: String,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        link: String,
      },
    ],
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      portfolio: String,
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
