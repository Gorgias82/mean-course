const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const mongoose = require('mongoose');
// const { createShorthandPropertyAssignment } = require('typescript');



//devuelve una promesa, recibe los datos de conexion incluyendo el nombre de la base de datos
//en este caso node-angular, si no existe la crea
mongoose.connect("mongodb+srv://jorge:XP9G2w4799Qwbp2o@cluster0.dn5xd.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log('Connection failed');
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use("/images", express.static(path.join("./images")));

//con next salta a la siguiente middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-Width,Content-Type,Accept,Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,DELETE,PUT,OPTIONS"
    );
    next();
  });

  app.use("/api/posts", postsRoutes);
  app.use("/api/user", userRoutes);

module.exports = app;