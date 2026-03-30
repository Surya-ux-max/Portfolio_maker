const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Experience = sequelize.define('Experience', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId: { type: DataTypes.UUID, allowNull: false },
  company:     { type: DataTypes.STRING },
  position:    { type: DataTypes.STRING },
  location:    { type: DataTypes.STRING },
  startDate:   { type: DataTypes.STRING },
  endDate:     { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
}, { timestamps: false });

module.exports = Experience;
