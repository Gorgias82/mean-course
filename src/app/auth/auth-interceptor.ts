import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({providedIn:'root'})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService){}

    //funciona como un middleware pero no emite respuesta
    intercept(req: HttpRequest<any>, next : HttpHandler) {
        const authToken   = this.authService.getToken();
        //recoge el request y lo clona
        //manipulando los headers añadiendo
        // un header authorization con el token precedido de la palabra bearer
        const authRequest = req.clone({
            //añade con set ojo!! authorization
            //debe ser lo mismo aunque case-insensitive que en check-auth
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        });
        return next.handle(authRequest);
    }
}