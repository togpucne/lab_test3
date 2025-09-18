const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {
  showRegister: (req, res) => res.render('auth/register'),
  register: async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) return res.render('auth/register', { error: 'Username or email exists', form: req.body });

      const hashed = await bcrypt.hash(password, 10);
      // By default role=user. To create admin, create manually or via seed.
      const user = new User({ username, password: hashed, email, phone });
      await user.save();
      req.session.user = { id: user._id, username: user.username, role: user.role };
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.render('auth/register', { error: 'Server error', form: req.body });
    }
  },

  showLogin: (req, res) => res.render('auth/login'),
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.render('auth/login', { error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.render('auth/login', { error: 'Invalid credentials' });

      req.session.user = { id: user._id, username: user.username, role: user.role };
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    } catch (err) {
      console.error(err);
      res.render('auth/login', { error: 'Server error' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(()=> res.redirect('/'));
  },

  showForgot: (req,res) => res.render('auth/forgot'),
  forgot: (req,res) => {
    // For lab: implement minimal – in real app send email. Here simply inform user.
    res.render('auth/forgot', { info: 'Yêu cầu đặt lại mật khẩu đã được gửi (giả lập).' });
  }
};
