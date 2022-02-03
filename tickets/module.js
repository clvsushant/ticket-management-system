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
