import { Injectable } from '@angular/core';
import { Post } from '../shared/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Post[] = [];
  constructor() { }

  getPosts(){
    //crea un nuevo array copiando el anterior, se se pasa sin mas lo pasa por referencia
    return [...this.posts]
  }
}
