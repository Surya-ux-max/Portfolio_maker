const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PortfolioSettings = sequelize.define('PortfolioSettings', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId: { type: DataTypes.UUID, allowNull: false, unique: true },
  theme: {
    type:         DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light',
  },
  isPublic: {
    type:         DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, { timestamps: false });

module.exports = PortfolioSettings;
