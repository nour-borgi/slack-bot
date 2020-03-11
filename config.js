require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  user_token: process.env.USER_TOKEN,
  name: process.env.NAME,
  siging_secret: process.env.SLACK_SIGNING_SECRET,
};
