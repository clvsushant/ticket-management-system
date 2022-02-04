const database = require('../../database');

exports.startServer = async () => {
  await database.connectToDB();
  await database.Ticket.destroy({
    truncate: true,
  });
};

exports.stopServer = async () => {
  await database.disconnectDB();
};
