const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sequelize, Portfolio, PersonalInfo, SocialLinks,
  PortfolioSettings, Education, Skill, Project,
  Experience, Certification, User,
} = require('../models');

// ── Helper: build the nested JSON shape the frontend expects ─────────────────
function formatPortfolio(p) {
  return {
    _id:        p.id,
    userId:     p.userId,
    templateId: p.templateId,
    personalInfo: p.PersonalInfo
      ? {
          name:         p.PersonalInfo.name,
          bio:          p.PersonalInfo.bio,
          role:         p.PersonalInfo.role,
          profilePhoto: p.PersonalInfo.profilePhoto,
          email:        p.PersonalInfo.email,
          phone:        p.PersonalInfo.phone,
          location:     p.PersonalInfo.location,
        }
      : {},
    education:      (p.Educations      || []).map(e => ({
      _id: e.id, institution: e.institution, degree: e.degree,
      fieldOfStudy: e.fieldOfStudy, startYear: e.startYear,
      endYear: e.endYear, description: e.description,
    })),
    skills:         (p.Skills          || []).map(s => ({ _id: s.id, name: s.name, level: s.level })),
    projects:       (p.Projects        || []).map(pr => ({
      _id: pr.id, title: pr.title, description: pr.description,
      techStack: pr.techStack, githubLink: pr.githubLink,
      liveLink: pr.liveLink, image: pr.image,
    })),
    experience:     (p.Experiences     || []).map(ex => ({
      _id: ex.id, company: ex.company, position: ex.position,
      location: ex.location, startDate: ex.startDate,
      endDate: ex.endDate, description: ex.description,
    })),
    certifications: (p.Certifications  || []).map(c => ({
      _id: c.id, name: c.name, issuer: c.issuer, date: c.date, link: c.link,
    })),
    socialLinks: p.SocialLink
      ? {
          github:    p.SocialLink.github,
          linkedin:  p.SocialLink.linkedin,
          twitter:   p.SocialLink.twitter,
          portfolio: p.SocialLink.portfolio,
        }
      : {},
    settings: p.PortfolioSetting
      ? { theme: p.PortfolioSetting.theme, isPublic: p.PortfolioSetting.isPublic }
      : { theme: 'light', isPublic: true },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// ── Include config for eager loading all associations ────────────────────────
const FULL_INCLUDE = [
  { model: PersonalInfo },
  { model: SocialLinks },
  { model: PortfolioSettings },
  { model: Education },
  { model: Skill },
  { model: Project },
  { model: Experience },
  { model: Certification },
];

// @route  GET /api/portfolio/me
router.get('/me', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where:   { userId: req.user.id },
      include: FULL_INCLUDE,
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(formatPortfolio(portfolio));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/portfolio  (create or update)
router.post('/', protect, async (req, res) => {
  const {
    templateId, personalInfo, education, skills,
    projects, experience, certifications, socialLinks, settings,
  } = req.body;

  const t = await sequelize.transaction();
  try {
    // 1. Upsert core portfolio row
    let [portfolio] = await Portfolio.findOrCreate({
      where:       { userId: req.user.id },
      defaults:    { userId: req.user.id, templateId: templateId || 'modern' },
      transaction: t,
    });

    if (templateId) {
      portfolio.templateId = templateId;
      await portfolio.save({ transaction: t });
    }

    const pid = portfolio.id;

    // 2. Upsert 1-to-1 children
    if (personalInfo) {
      await PersonalInfo.upsert({ ...personalInfo, portfolioId: pid }, { transaction: t });
    }
    if (socialLinks) {
      await SocialLinks.upsert({ ...socialLinks, portfolioId: pid }, { transaction: t });
    }
    if (settings) {
      await PortfolioSettings.upsert({ ...settings, portfolioId: pid }, { transaction: t });
    }

    // 3. Replace 1-to-many children (delete old rows, insert new)
    if (education !== undefined) {
      await Education.destroy({ where: { portfolioId: pid }, transaction: t });
      if (education.length) {
        await Education.bulkCreate(
          education.map(e => ({ ...e, portfolioId: pid })),
          { transaction: t }
        );
      }
    }
    if (skills !== undefined) {
      await Skill.destroy({ where: { portfolioId: pid }, transaction: t });
      if (skills.length) {
        await Skill.bulkCreate(
          skills.map(s => ({ ...s, portfolioId: pid })),
          { transaction: t }
        );
      }
    }
    if (projects !== undefined) {
      await Project.destroy({ where: { portfolioId: pid }, transaction: t });
      if (projects.length) {
        await Project.bulkCreate(
          projects.map(p => ({ ...p, portfolioId: pid })),
          { transaction: t }
        );
      }
    }
    if (experience !== undefined) {
      await Experience.destroy({ where: { portfolioId: pid }, transaction: t });
      if (experience.length) {
        await Experience.bulkCreate(
          experience.map(e => ({ ...e, portfolioId: pid })),
          { transaction: t }
        );
      }
    }
    if (certifications !== undefined) {
      await Certification.destroy({ where: { portfolioId: pid }, transaction: t });
      if (certifications.length) {
        await Certification.bulkCreate(
          certifications.map(c => ({ ...c, portfolioId: pid })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Re-fetch with all associations for response
    const updated = await Portfolio.findOne({
      where:   { id: pid },
      include: FULL_INCLUDE,
    });

    res.json(formatPortfolio(updated));
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/portfolio/public/:username
router.get('/public/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const portfolio = await Portfolio.findOne({
      where:   { userId: user.id },
      include: FULL_INCLUDE,
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const settings = portfolio.PortfolioSetting;
    if (settings && !settings.isPublic) {
      return res.status(404).json({ message: 'Portfolio is private or not found' });
    }

    res.json({
      user:      { name: user.name, username: user.username },
      portfolio: formatPortfolio(portfolio),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
