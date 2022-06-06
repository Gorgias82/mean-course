const jwt = require("jsonwebtoken");
const { catchError } = require("rxjs");

module.exports = (req, res, next) => {

    try{
        //se espera recibir un string que sea Bearer token
        //siendo token el codigo que recibimos en el login
        //asi que se separa por espacios en blanco y se coge
        //el segundo elemento del array para coger el token
        const token = req.headers.authorization.split(" ")[1];

        //pasamos como argumentos el token y el string
        //que es como el salt que usamos en user al crear el token
        //si no es correcto saltara un error asi que pasara al bloque
        //de catch
        //devuelve el token descodificado
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        //usamos el token descodificado para extrar el email y el id de usuario
        // y ponerlo en un nuevo request, como el checkAuth se pone previo al middleware
        //donde se insertan posts lo podremos recoger alli para asociar el usuario
        //al nuevo post
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        //si no saltado error pasa al siguiente middleware
        next();
    }catch(error){
        res.status(401).json({message: "You are not authenticated!"});
    }
    
};