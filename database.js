const { Sequelize, DataTypes } = require('sequelize');

const storage = process.env.DB_PATH || 'db.sqlite3';
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
});

exports.Ticket = sequelize.define('Ticket', {
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
