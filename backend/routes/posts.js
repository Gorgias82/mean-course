const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const multer = require("multer");
const { createShorthandPropertyAssignment } = require("typescript");

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
router.post("", multer({storage: storage}).single("image") ,(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath : url + "/images/" + req.file.filename
    });
    //guarda el dato en la base de datos en la collection que es el nombre en plural en este caso posts
    // recogemos el id del post nuevo que se acaba de insertar
    post.save().then(result => {
      console.log(result);
      res.status(201).json({
        message : 'Post added succesfully',
        post : {
          ...createdPost,
          id : createdPost._id
        
        }
    });
    });
  
});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  //entonces es q ha subido una nueva imagen
  if ( req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id : req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath : imagePath
  });
  Post.updateOne({_id : req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message : "Update succesful"});
  });
});

router.get('',(req, res, next) => {
  //el + delante los castea a numbers
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    //aque no se ejecuta el find solo se almacena en la constante
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
      //no saca el numero que se le indica, se los salta
      // y limita la busqueda al tamaño de la pagina
      postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
    }
    //devuelve todos los posts si no se le pasan mas datos
    //se puede pasar una funcion arrow como callback
    //tambien podemos usar el metodo then
    postQuery
    .then(documents => {
      //no se podria acceder en el segundo then a la primera consulta
      // asique se almacena en una variable
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message : "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts : count
      });
    });
    
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
      console.log(post);
    }else{
      res.status(404).json({message: 'Post not found!'});
    }
  })
});


router.delete("/:id", (req, res , next) => {
  Post.deleteOne({_id : req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted!'});
  })

})

module.exports = router;