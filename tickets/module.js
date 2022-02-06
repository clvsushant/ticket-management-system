const { Ticket } = require('../database');
const { createTickectSchema } = require('./validation');

exports.createTicket = async (ticketPayload, existingUserId) => {
  await createTickectSchema.validateAsync(ticketPayload);
  return await Ticket.create({
    category: ticketPayload.category,
    subcategory: ticketPayload.subcategory,
    title: ticketPayload.title,
    description: ticketPayload.description,
    createdBy: existingUserId,
    assignedTo: ticketPayload.assignedTo,
  });
};

exports.getTicketById = async (ticketId) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) {
    throw new Error('Invalid Ticket Id');
  }
  return ticket;
};

exports.getAllTickets = async () => {
  const tickets = await Ticket.findAll();
  if (!tickets) {
    throw new Error('No tickets found');
  }
  return tickets;
};

exports.deleteTicketById = async (ticketId) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) {
    throw new Error('Invalid Ticket Id');
  }
  await ticket.destroy();
  return 'Ticket deleted successfully';
};

exports.updateTicketById = async (ticketId, ticketPayload) => {
  const ticket = await Ticket.findByPk(ticketId);
  if (!ticket) {
    throw new Error('Invalid Ticket Id');
  }
  if (ticketPayload.status === 'closed') {
    ticketPayload.closedAt = new Date();
  }
  await ticket.update(ticketPayload);
  await ticket.save();
  return ticket;
};
