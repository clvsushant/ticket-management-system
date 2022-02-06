const { Router } = require('express');
const { ensureUser } = require('../utils/auth');
const {
  getAllTickets,
  createTicket,
  getTicketById,
  deleteTicketById,
  updateTicketById,
} = require('./module');
const route = Router();

route.get('/', ensureUser, async (req, res, next) => {
  try {
    res.status(200).send(await getAllTickets());
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.post('/', ensureUser, async (req, res, next) => {
  try {
    res.status(201).send(await createTicket(req.body, req.user.id));
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.get('/:id', ensureUser, async (req, res, next) => {
  try {
    res.status(200).send(await getTicketById(req.params.id));
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.delete('/:id', ensureUser, async (req, res, next) => {
  try {
    res.status(200).send(await deleteTicketById(req.params.id));
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.put('/:id', ensureUser, async (req, res, next) => {
  try {
    res.status(200).send(await updateTicketById(req.params.id, req.body));
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = route;
