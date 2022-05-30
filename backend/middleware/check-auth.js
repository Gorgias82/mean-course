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
        jwt.verify(token, "secret_this_should_be_longer");
        //si no saltado error pasa al siguiente middleware
        next();
    }catch(error){
        res.status(401).json({message: "Auth failed!"});
    }
    
};