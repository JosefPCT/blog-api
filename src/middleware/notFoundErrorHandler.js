const { NotFound } = require('../utils/extended-errors');

module.exports.notFoundErrorHandler = (req, res, next) => {
  next(new NotFound(`Route ${req.originalUrl} not found`));
}

