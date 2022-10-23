require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4000;

const urlencodedParser = bodyParser.urlencoded({ extended:false });

// Database configuration
mongoose.connect(process.env.DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the Mongo DB database"));

// Middlewares
app.use(express.urlencoded({ extented: false }));
app.use(express.json());

app.use(
  session({
    secret: "My Secret Key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));
app.use(express.static("public"));

// Set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/shvAdminGDRoute"));
app.use("", require("./routes/sugAdminADRoute"));
app.use("", require("./routes/ud_AdminIDRoute"));
app.use("", require("./routes/th_adminRoute"));
app.use("", require("./routes/shvClientGDRoute"));
app.use("", require("./routes/sugClientADRoute"));
app.use("", require("./routes/th_customerRoute"));
app.use("", require("./routes/ud_ClientIDRoute"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
