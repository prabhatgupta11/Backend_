const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import models and define associations
const Poll = require("./PollModel")(sequelize);
const QuestionSet = require("./QuestionSetModel")(sequelize);
const PollAnalytics = require("./PollAnalyticsModel")(sequelize);
const User = require("./UserModel")(sequelize);

// Define associations
Poll.hasMany(QuestionSet, { foreignKey: "pollId", as: "QuestionSets" });
QuestionSet.belongsTo(Poll);

// PollAnalytics associations
Poll.hasOne(PollAnalytics);
PollAnalytics.belongsTo(Poll);

Poll.hasOne(PollAnalytics, { foreignKey: "pollId", as: "PollAnalyticss" });

// QuestionSet associations
QuestionSet.belongsTo(Poll);

// User associations
User.hasMany(Poll, { foreignKey: "userID", as: "polls" });
Poll.belongsTo(User);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the models and Sequelize instance
db.Poll = Poll;
db.QuestionSet = QuestionSet;
db.User = User;
db.PollAnalytics = PollAnalytics;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
