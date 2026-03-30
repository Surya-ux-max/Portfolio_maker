const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SocialLinks = sequelize.define('SocialLinks', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId:  { type: DataTypes.UUID, allowNull: false, unique: true },
  github:       { type: DataTypes.STRING },
  linkedin:     { type: DataTypes.STRING },
  twitter:      { type: DataTypes.STRING },
  portfolio:    { type: DataTypes.STRING },
}, { timestamps: false });

module.exports = SocialLinks;
