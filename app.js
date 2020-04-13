const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser")
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

const userRoutes = require("./routes/user");
const blogRoutes = require('./routes/blog');
const propertyRoutes = require('./routes/property');
const propertyReviewRoutes = require('./routes/property_review');
const WishlistRoutes = require("./routes/wishlist");

app.use(helmet()); // Sanitization of requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); // Parsing requests as in JSON format
app.use(cors()); //Use CORS

app.use(express.static('static'));
app.use("/auth", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/property", propertyRoutes);
app.use("/property_review", propertyReviewRoutes);
app.use("/wishlist", WishlistRoutes);


// Error handling
app.use((req, res) => {
  return res.status(500).json({ message: "Server Error, Something Broke" });
});

// Start Server
app.listen(port, () => console.log("Server running on port", port, "..."));

module.exports = {app}