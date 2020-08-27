const mongoose = require("mongoose");

const db = () => {
  return mongoose.connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) return console.log("ERROR = = = ", err);
      console.log("Mongo works ...");
    }
  );
};

module.exports = db;
