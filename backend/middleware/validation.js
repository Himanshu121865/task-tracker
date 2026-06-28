import { body, param, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['dropped', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('color')
    .optional()
    .isIn(['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'brown', 'gray']).withMessage('Invalid color'),
  body('pinned')
    .optional()
    .isBoolean().withMessage('pinned must be boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('order must be a non-negative integer'),
  handleValidationErrors,
];

export const validateId = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  handleValidationErrors,
];
