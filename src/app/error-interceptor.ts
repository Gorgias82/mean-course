
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) { }


  //Siempre que haya un error en cualquier request http se aplicara este interceptor
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      //hacemos un hook al response observable stream que nos proporciona el metodo handle
      // para escuchar los eventos, con pipe añadimos un operador al stream
      .pipe(
        catchError((error: HttpErrorResponse) => {
          //comprobamos si tiene un mensaje de error
          let errorMessage = "Ha ocurrido un error desconocido";
          if (error.error.message) {
            errorMessage = error.error.message;
          }
          //dialog este de materials, el metodo open recibe un componente
          // que es que renderizara
          this.dialog.open(ErrorComponent, { data: { message: errorMessage } })

          //este genera un nuevo observable
          return throwError(() => error);
        })
      );
  }
}
