const express = require('express');
const app = express();
const bodyParser = require("body-parser");
//con next salta a la siguiente middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-Width,Content-Type,Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,DELETE,PUT,OPTIONS"
    );
    next();
  });
// Contraseña mongodb usuario:jorge password:   XP9G2w4799Qwbp2o
app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message : 'Post added succesfully'
    });
});
app.get('/api/posts',(req, res, next) => {
    const posts = [
        {id : '1', title: 'First post', content: "content from the server"},
        {id : '2', title: 'Second post', content: "content from the server"}
    ];
    res.status(200).json(posts);
});

module.exports = app;