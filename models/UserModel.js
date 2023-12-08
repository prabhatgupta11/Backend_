const { DataTypes } = require("sequelize");

module.exports = (Sequelize) => {
  const User = Sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    votedQuestions: {
      type: DataTypes.TEXT,
      get() {
        // Parse the stringified array when retrieving from the database
        const value = this.getDataValue('votedQuestions');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        // Stringify the array when storing in the database
        this.setDataValue('votedQuestions', JSON.stringify(value));
      },
    },
  });

  return User;
};
