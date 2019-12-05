const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000; // go back to project to check port

const app = express();


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useNewURLParser: true});


//Routes

//GET Route for website
app.get("/scrape", function(req,res){
    axios.get("https://www.theverge.com/").then(function(response) {

        var $ = cheerio.load(response.data);

        //grab article title
        $("article a").each(function(i, element) {
            //save empty result object
            var result = {};
            // Add the text and href of every link, and save them as properties 
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            //Create a new Article
            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
        //send message when scrape is finished
        res.send("Finished Scrape!");
    });
});

//Routing for getting all Articles from db

app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
          res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
});

//Routing for saving/updating Article's associated Note
app.post("/articles/:id", function(req, res) {

    //create new note
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});