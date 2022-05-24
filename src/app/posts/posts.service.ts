import { Injectable } from '@angular/core';
import { Post } from '../shared/models/post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Post[] = [];
  // subject es un eventEmitter pero para un uso mas amplio
  private postsUpdated = new Subject<Post[]>();

  constructor(private http : HttpClient) { }

  getPosts(){
    //crea un nuevo array copiando el anterior, se se pasa sin mas lo pasa por referencia
    // return [...this.posts]

    //http.get o post devuelve un Observable, al cual nos subscribimos
    this.http.get<Post[]>('http://localhost:3000/api/posts').subscribe((postData) => {
      this.posts = postData;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    //devuelve un objeto que podemos escuchar pero no usar para emitir
    return this.postsUpdated.asObservable();
  }

  addPost(post:Post){
    this.http.post<{message:string}>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      //emite un nuevo un valor que es una copia del array de posts
      this.postsUpdated.next([...this.posts]);
    });
 
  }
}
