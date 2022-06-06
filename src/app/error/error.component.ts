import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message = 'Un error desconocido';
  // inject recibe un token y data es que lo que recibimos del interceptor
  //a partir de ese momento ya esta en el componente
  constructor(@Inject(MAT_DIALOG_DATA) public data : {message : string}) { }

  ngOnInit(): void {
  }

}
