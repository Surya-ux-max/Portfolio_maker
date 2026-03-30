const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  userId: {
    type:      DataTypes.UUID,
    allowNull: false,
    unique:    true,
  },
  templateId: {
    type:         DataTypes.STRING,
    defaultValue: 'modern',
  },
}, { timestamps: true });

module.exports = Portfolio;
