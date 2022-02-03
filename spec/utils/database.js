const database = require('../../database');

exports.startServer = async () => {
  await database.connectToDB();
  await database.User.destroy({
    where: {},
    truncate: true,
  });
};

exports.stopServer = async () => {
  await database.disconnectDB();
};
