const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sessionAuth")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sessionAuth",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 ngày
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  res.locals.message = req.session ? req.session.message : null;

  // Nếu có message trong query string
  if (req.query.message) {
    res.locals.message = req.query.message;
  }

  if (req.session) {
    delete req.session.message;
  }
  next();
});


// Routes
const supplierRoutes = require("./routes/supplierRoute");
const productRoutes = require("./routes/productRoute");
const authRoutes = require("./routes/authRoute");
const Supplier = require("./models/supplier");
const Product = require("./models/product");  // nếu bạn có model mongoose



app.use("/auth", authRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/products", productRoutes);

app.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    const products = await Product.find().populate("supplierId"); // ✅ populate supplier

    res.render("index", {
      user: req.session.user || null,
      suppliers,
      products,
      message: products.length > 0 ? null : "Chưa có sản phẩm nào"
    });
  } catch (err) {
    console.error("Error loading homepage:", err.message);
    res.render("index", { 
      user: req.session.user || null, 
      suppliers: [], 
      products: [],        
      message: "Không tải được dữ liệu!" 
    });
  }
});


// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
