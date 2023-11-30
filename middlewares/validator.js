import createDebug from 'debug';
import { validationResult } from 'express-validator';
import { UNPROCESSABLE_ENTITY } from 'http-status';
import { map } from 'lodash';

const debug = createDebug('api:validator');

export default async (req, res, next) => {
  const validatorResult = validationResult(req);
  if (!validatorResult.isEmpty()) {
    const errors = map(
      validatorResult.array({ onlyFirstError: true }),
      (mappedError) => {
        return mappedError.msg;
      },
    );
    debug('validation result not empty...', errors);

    res.status(UNPROCESSABLE_ENTITY).json({
      errors,
    });
  } else {
    next();
  }
};