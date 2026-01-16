module.exports = {
  isAuthenticated: async (ctx, next) => {
    if (ctx.session && ctx.session.user) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Authentication required' };
    }
  },
  isAdmin: async (ctx, next) => {
    if (ctx.session && ctx.session.user && ctx.session.user.role === 'admin') {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = { error: 'Admin access required' };
    }
  }
};
