// PollModel.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Poll = sequelize.define("Poll", {
    userID: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    minReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Poll;
};

