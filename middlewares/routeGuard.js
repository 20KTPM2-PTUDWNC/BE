import { FORBIDDEN } from 'http-status';

import { apiError } from './../constants';

/**
 * prevent user enter api without authorization
 * @param allowRoles list allowed roles
 */
export const routeGuard = (allowedRoles) => {
    return (req, res, next) => {
        const hasPermission = allowedRoles.includes(Number(req.user.userFlag));

        if (!hasPermission) {
            return res.status(FORBIDDEN).json({ message: apiError.forbidden });
        }

        return next();
    };
};