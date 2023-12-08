const { DataTypes } = require("sequelize");

module.exports = (Sequelize) => {
  const PollAnalytics = Sequelize.define("pollAnalytics", {
    pollId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    optionCounts: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  return PollAnalytics;
};
