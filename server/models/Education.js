const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Education = sequelize.define('Education', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId:  { type: DataTypes.UUID, allowNull: false },
  institution:  { type: DataTypes.STRING },
  degree:       { type: DataTypes.STRING },
  fieldOfStudy: { type: DataTypes.STRING },
  startYear:    { type: DataTypes.STRING },
  endYear:      { type: DataTypes.STRING },
  description:  { type: DataTypes.TEXT },
}, { timestamps: false });

module.exports = Education;
