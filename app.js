//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");

var posts = [];
const uri =
  "xxxxxxxx";

const homeStartingContent = "";
const aboutContent = "Hello world  ";

const contactContent = "contact me";

const app = express();
var axios = require("axios");
var data = JSON.stringify({
  collection: "events",
  database: "test",
  dataSource: "your database",
  projection: {
    title: 1,
    content: 1,
  },
});

var config = {
  method: "post",
  url: "xxxxxx",

  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key":
      "xxxxxxx",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    var x = response.data.documents;
    x.forEach((element) => {
      var cloudData = {
        title: element.title,
        content: element.content,
      };
      //console.log(cloudData);
      posts.push(cloudData);
    });
   
  })
  .catch(function (error) {
   
    console.log(error);
  });

mongoose.connect(uri);
mongoose.Promise = global.Promise;
var eventSchema = mongoose.Schema({
  title: String,
  content: String,
});

var eventData = mongoose.model("Event", eventSchema);

//Load home page using endpoint
app.get("/", (req, res) => {
  return res.render("home", {
    startingContent: homeStartingContent,
    posts,
  });
});


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", { startingContent: homeStartingContent, posts });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

///
app.get("/addPost", function (req, res) {
  res.render("addPost");
});

// Creating a POST request
app.post("/addPost", function (req, res) {
  const post = {
    title: req.body.inputTitle,
    content: req.body.postBody,
  };
  posts.push(post);

  new eventData(post)
    .save()
    .then((result) => {
      // note the use of a different variable name

      return res.send(result); // also, you generally want to send *something* down that lets the user know
    })
    .catch((err) => {
      return res.status(400);
    });
  return res.redirect("/");
});

app.get("/posts/:test", function (req, res) {
  const test = _.lowerCase(req.params.test);

  posts.forEach((i) => {
    const storedTitle = _.lowerCase(i.title);

    if (storedTitle === test) {
      res.render("post", {
        title: i.title,
        content: i.content,
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started succesfully");
});
