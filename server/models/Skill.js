const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Skill = sequelize.define('Skill', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId: { type: DataTypes.UUID, allowNull: false },
  name:        { type: DataTypes.STRING },
  level: {
    type:         DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert'),
    defaultValue: 'Beginner',
  },
}, { timestamps: false });

module.exports = Skill;
