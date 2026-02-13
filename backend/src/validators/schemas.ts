import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
});

export const createCitizenProfileSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  aadharNumber: Joi.string().pattern(/^[0-9]{12}$/).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('M', 'F', 'O').optional(),
  category: Joi.string().optional(),
  familyIncome: Joi.number().positive().optional(),
});

export const updateCitizenProfileSchema = Joi.object({
  aadharNumber: Joi.string().pattern(/^[0-9]{12}$/).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('M', 'F', 'O').optional(),
  category: Joi.string().optional(),
  familyIncome: Joi.number().positive().optional(),
});

export const createDocumentSchema = Joi.object({
  citizenProfileId: Joi.string().uuid().required(),
  documentType: Joi.string().required(),
  documentUrl: Joi.string().uri().required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().optional(),
  order: Joi.string().valid('ASC', 'DESC').default('DESC'),
});
