import Boom from 'boom';

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const { role } = req.payload;

      // Admin and superadmin have full access to all resources
      if (role === 'admin' || role === 'superadmin') {
        return next();
      }

      // For non-admin users, check specific permissions
      switch (resource) {
        case 'order':
          if (action === 'create' || (action === 'read' && req.path === '/my-orders')) {
            return next();
          }
          break;
        case 'product':
          if (action === 'read' || action === 'readAny') {
            return next();
          }
          break;
        case 'delivery':
          if (action === 'read' && (req.path === '/my-deliveries' || req.path.includes('my-deliveries'))) {
            return next();
          }
          break;
        case 'review':
          if (action === 'create') {
            return next();
          }
          if (action === 'read' || action === 'readAny') {
            return next();
          }
          break;
        default:
          break;
      }

      return next(Boom.forbidden('You are not allowed to perform this action'));
    } catch (error) {
      next(error);
    }
  };
};

export default grantAccess;
