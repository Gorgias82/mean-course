const checkAuth = require("../middleware/check-auth");
const Post = require('../models/post');




  exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath : url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });

    //guarda el dato en la base de datos en la collection que es el nombre en plural en este caso posts
    // recogemos el id del post nuevo que se acaba de insertar
    post.save().then(result => {
      res.status(201).json({
        message : 'Post added succesfully',
        post : {
          result,
          id : result._id
        
        }
    });
  
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post failed!'
      })
    })
    
};

exports.updatePost =  (req, res, next) => {
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
      imagePath : imagePath,
      creator: req.userData.userId
    });
    //los argumentos que se le pasan al updateOne seran los que use para filtrar
    //que post se actualiza seria como el where
    Post.updateOne({_id : req.params.id, creator: req.userData.userId}, post).then(result => {
      //seria como el affected rows, lo usa para comprobar
      //que sea el creador del pos quien lo actualiza
      if(result.nModified  > 0){
        res.status(200).json({message : "Update succesful"});
      }else{
        res.status(401).json({ message: "Not authorized!"});
      }
      
    })
    //aunque antes controlaba si el usuario era el autor de post, 
    //tambien se puede añadir un catch para posibles errores tecnicos
    .catch(error => {
      res.status(500).json({
        message: "Could not update post!"
      });
    });
  }

  exports.getPosts = (req, res, next) => {
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
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching posts failed"
        });
      });
      
  };

  exports.getPost =  (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if(post){
        res.status(200).json(post);
        console.log(post);
      }else{
        res.status(404).json({message: 'Post not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
  };

  exports.deletePost = checkAuth, (req, res , next) => {
    Post.deleteOne({_id : req.params.id, creator:  req.userData.userId}).then(result => {
      if(result.n  > 0){
        res.status(200).json({message : "Delete succesful"});
      }else{
        res.status(401).json({ message: "Not authorized!"});
      }
    
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
  };