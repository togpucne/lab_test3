const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = {
  showRegister: (req, res) =>
    res.render("auth/register", { error: null, form: {} }),

  register: async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        return res.render("auth/register", {
          error: "⚠ Username hoặc Email đã tồn tại!",
          form: req.body,
        });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashed, email, phone });
      await user.save();

      req.session.user = {
        id: user._id,
        username: user.username,
        role: user.role,
      };
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.render("auth/register", { error: "❌ Lỗi server", form: req.body });
    }
  },

  showLogin: (req, res) => res.render("auth/login", { error: null }),

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user)
        return res.render("auth/login", {
          error: "Sai tài khoản hoặc mật khẩu!",
        });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.render("auth/login", {
          error: "Sai tài khoản hoặc mật khẩu!",
        });

      // ✅ Lưu user vào session
      req.session.user = {
        id: user._id,
        username: user.username,
        role: user.role,
      };

      // ✅ Lưu message vào session
      req.session.message = "Đăng nhập thành công!";

      // ✅ Chuyển hướng qua products
      res.redirect("/products");
    } catch (err) {
      console.error(err);
      res.render("auth/login", { error: "Lỗi server!" });
    }
  },
  logout: (req, res) => {
    // Đặt message trước khi hủy session
    const message = "Đăng xuất thành công!";
    req.session.destroy(() => {
      // Gắn lại message vào 1 session tạm bằng cookie mới
      res.clearCookie("connect.sid"); // xoá session cũ
      req.session = null; // xoá tham chiếu

      // Trick nhỏ: dùng query để pass message
      res.redirect("/?message=" + encodeURIComponent(message));
    });
  },
  showForgot: (req, res) => res.render("auth/forgot", { info: null }),

  forgot: (req, res) => {
    res.render("auth/forgot", {
      info: "📩 Yêu cầu đặt lại mật khẩu đã được gửi (giả lập).",
    });
  },
};
