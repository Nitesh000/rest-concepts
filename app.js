const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.set("view engine", 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true});

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("article", articleSchema);

///////////////////////////////Requesting targetiing all articles/////////////////////////////

app.route("/articles")
.get((req, res) => {
    Article.find((err, foundArticles) => {
        if(err) {
            console.log(err);
        } else {
            res.send(foundArticles);
        }
    })
})
.post((req, res) => {

    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save((err) => {
        if(!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})
.delete((req, res) => {
    Article.deleteMany((err) => {
        if(!err) {
            res.send("Deleted every article.");
        } else {
            res.send(err);
        }
    })
})

///////////////////////////////Requesting targetiing a perticular articles/////////////////////////////

app.route("/articles/:articleTitle") 
.get((req, res) => {
    Article.findOne({title : req.params.articleTitle}, (err, foundArticle)=> {
        if(!err) {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article was found!!!");
            }
        } else {
            res.send(err);
        }
    })
})

.put((req, res) => {
    Article.updateOne(
        {title : req.params.articleTitle}, 
        {title : req.body.title, content : req.body.content},
        (err) => {
            if(!err) {
                res.send("Updated successfully.");
            } else {
                res.send(err);
            }
        }
    );
})

.patch((req, res)=> {
    Article.updateOne(
        {title : req.params.articleTitle},
        {$set : req.body},
        (err) => {
            if(!err) {
                res.send("Successfully stored the article.");
            } else {
                res.send(err);
            }
        }
    )
})

.delete((req, res)=> {
    Article.deleteOne({title : req.params.articleTitle}, (err)=> {
        if(err) {
            res.send(err);
        } else {
            res.send("Article is deleted.")
        }
    })
})




app.listen("3000", () => {
    console.log("Server has started successfully.")
})