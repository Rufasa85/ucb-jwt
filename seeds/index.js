const sequelize = require("../config/connection");
const { User } = require("../models");

const users = [
  {
    email: "joe@joe.joe",
    password: "password",
  },
  {
    email: "shiva@joe.joe",
    password: "iAteDaddysWires",
  },
];

const seedMe = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(users, {
    individualHooks: true,
  });
  process.exit(0);
};

seedMe();
