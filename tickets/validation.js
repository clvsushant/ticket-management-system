const Joi = require('joi');

exports.createTickectSchema = Joi.object({
  category: Joi.string()
    .required()
    .messages({ 'any.required': 'Category is required' }),
  subcategory: Joi.string()
    .required()
    .messages({ 'any.required': 'Subcategory is required' }),
  title: Joi.string()
    .required()
    .messages({ 'any.required': 'Title is required' }),
  description: Joi.string()
    .required()
    .messages({ 'any.required': 'Description is required' }),
  assignedTo: Joi.string()
    .required()
    .messages({ 'any.required': 'assignedTo is required' }),
});
