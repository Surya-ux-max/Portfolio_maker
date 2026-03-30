const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PersonalInfo = sequelize.define('PersonalInfo', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId: { type: DataTypes.UUID, allowNull: false, unique: true },
  name:         { type: DataTypes.STRING },
  bio:          { type: DataTypes.TEXT },
  role:         { type: DataTypes.STRING },
  profilePhoto: { type: DataTypes.STRING },
  email:        { type: DataTypes.STRING },
  phone:        { type: DataTypes.STRING },
  location:     { type: DataTypes.STRING },
}, { timestamps: false });

module.exports = PersonalInfo;
