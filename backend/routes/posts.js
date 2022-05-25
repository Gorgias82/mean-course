const express = require("express");
const Post = require('../models/post');
const router = express.Router();


router.post("", (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    //guarda el dato en la base de datos en la collection que es el nombre en plural en este caso posts
    // recogemos el id del post nuevo que se acaba de insertar
    post.save().then(result => {
      console.log(result);
      res.status(201).json({
        message : 'Post added succesfully',
        postid : result._id
    });
    });
  
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id : req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id : req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message : "Update succesful"});
  });
});

router.get('',(req, res, next) => {
    console.log("prueba");
    //devuelve todos los posts si no se le pasan mas datos
    //se puede pasar una funcion arrow como callback
    //tambien podemos usar el metodo then
    Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({message : "Consulta correcta", posts: documents});
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