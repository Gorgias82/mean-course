const multer = require("multer");
const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
  };

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if(isValid){
        error = null;
      }
      //el primer parametro es que devuelve si hay error
      //el segundo la ruta relativa con respecto a server.js
      //donde se almacenara el fichero
      cb(error, "./images");
    },
    filename : (req, file, cb) => {
      //lo pone en minusculas y cambia los espacios por -
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
  })

  module.exports =  multer({storage: storage}).single("image");