const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createuser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "user created",
            result: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Invalid authentication credentials!",
          });
        });
    });
  };

  exports.userLogin =  (req, res, next) => {
    //usamos una variable declarada fuera de los bloques
    //then para pasar variables entre ellos
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        //le pasamos tres argumentos, el payload con el contenido
        //un string que es como el salt, y opciones(en este caso la caducidad)
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "secret_this_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          //aunque el userid esta en el token y se podria descodificar en el front
          //no se hace para no sobrecargarlo
          userId: fetchedUser._id,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      });
  };