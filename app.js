const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser")
require("dotenv").config();

const app = express();

const port = 3000 || process.env.PORT;

const authRoutes = require("./routes/auth");
const blogRoutes = require('./routes/blog');

app.use(helmet()); // Sanitization of requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); // Parsing requests as in JSON format
app.use(cors()); //Use CORS

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);


// Error handling
app.use((req, res) => {
  return res.status(500).json({ message: "Server Error, Something Broke" });
});

// Start Server
app.listen(port, () => console.log("Server running on port", port, "..."));