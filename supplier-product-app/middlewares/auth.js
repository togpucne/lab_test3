module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.session.user) return next();
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  },

  ensureAdmin: (req, res, next) => {
    const user = req.session.user;
    if (user && user.role === 'admin') return next();
    return res.status(403).send('Forbidden: Admin only');
  }
};
