const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId: { type: DataTypes.UUID, allowNull: false },
  title:       { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  techStack:   { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  githubLink:  { type: DataTypes.STRING },
  liveLink:    { type: DataTypes.STRING },
  image:       { type: DataTypes.STRING },
}, { timestamps: false });

module.exports = Project;
