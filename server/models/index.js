const sequelize       = require('../config/db');
const User            = require('./User');
const Portfolio       = require('./Portfolio');
const PersonalInfo    = require('./PersonalInfo');
const SocialLinks     = require('./SocialLinks');
const PortfolioSettings = require('./PortfolioSettings');
const Education       = require('./Education');
const Skill           = require('./Skill');
const Project         = require('./Project');
const Experience      = require('./Experience');
const Certification   = require('./Certification');

// ── Associations ──────────────────────────────────────────────────────────────

// User ↔ Portfolio (1-to-1)
User.hasOne(Portfolio,    { foreignKey: 'userId', onDelete: 'CASCADE' });
Portfolio.belongsTo(User, { foreignKey: 'userId' });

// Portfolio ↔ 1-to-1 children
Portfolio.hasOne(PersonalInfo,      { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
PersonalInfo.belongsTo(Portfolio,   { foreignKey: 'portfolioId' });

Portfolio.hasOne(SocialLinks,       { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
SocialLinks.belongsTo(Portfolio,    { foreignKey: 'portfolioId' });

Portfolio.hasOne(PortfolioSettings, { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
PortfolioSettings.belongsTo(Portfolio, { foreignKey: 'portfolioId' });

// Portfolio ↔ 1-to-many children
Portfolio.hasMany(Education,      { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Education.belongsTo(Portfolio,    { foreignKey: 'portfolioId' });

Portfolio.hasMany(Skill,          { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Skill.belongsTo(Portfolio,        { foreignKey: 'portfolioId' });

Portfolio.hasMany(Project,        { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Project.belongsTo(Portfolio,      { foreignKey: 'portfolioId' });

Portfolio.hasMany(Experience,     { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Experience.belongsTo(Portfolio,   { foreignKey: 'portfolioId' });

Portfolio.hasMany(Certification,  { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Certification.belongsTo(Portfolio,{ foreignKey: 'portfolioId' });

// ── Exports ───────────────────────────────────────────────────────────────────
module.exports = {
  sequelize,
  User,
  Portfolio,
  PersonalInfo,
  SocialLinks,
  PortfolioSettings,
  Education,
  Skill,
  Project,
  Experience,
  Certification,
};
