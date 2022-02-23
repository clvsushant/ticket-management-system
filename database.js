const { Sequelize, DataTypes } = require('sequelize');

const storage = process.env.DB_PATH || 'db.sqlite3';
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
});

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category: {
    type: DataTypes.ENUM('asset', 'employee', 'other'),
    defaultValue: 'other',
  },
  subcategory: {
    type: DataTypes.ENUM('requestAllocation', 'requestDeallocation'),
    defaultValue: 'requestAllocation',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
  closedAt: {
    type: DataTypes.DATE,
  },
});

const TicketHistory = sequelize.define('TicketHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Create new ticket',
  },
  ticket: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.UUID,
  },
});

const TicketWithHistory = sequelize.define('TicketWithHistory', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  history: {
    type: DataTypes.UUID,
  },
});

// Ticket.hasOne(TicketHistory, { foreignKey: 'ticket' });
TicketHistory.belongsTo(Ticket, { foreignKey: 'ticket' });
TicketWithHistory.belongsTo(Ticket, { foreignKey: 'id' });
TicketWithHistory.belongsTo(TicketHistory, { foreignKey: 'history' });

exports.Ticket = Ticket;
exports.TicketHistory = TicketHistory;
exports.TicketWithHistory = TicketWithHistory;

exports.connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    await sequelize.sync({ force: true });
    console.log('Tables are now available');
  } catch (err) {
    console.error(err);
  }
};

exports.disconnectDB = async () => {
  await sequelize.close();
};
