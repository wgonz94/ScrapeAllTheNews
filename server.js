var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path")
var PORT = process.env.PORT || 3000;

var app = express();
require("./routes/apiRoutes")(app);

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));

const exphbs = require("express-handlebars")
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



//server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});