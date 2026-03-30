const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certification = sequelize.define('Certification', {
  id: {
    type:         DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:   true,
  },
  portfolioId: { type: DataTypes.UUID, allowNull: false },
  name:        { type: DataTypes.STRING },
  issuer:      { type: DataTypes.STRING },
  date:        { type: DataTypes.STRING },
  link:        { type: DataTypes.STRING },
}, { timestamps: false });

module.exports = Certification;
