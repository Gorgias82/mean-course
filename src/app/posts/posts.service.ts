import { Injectable } from '@angular/core';
import { Post } from '../shared/models/post.model';
import { Subject } from 'rxjs';

import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts : Post[] = [];
  // subject es un eventEmitter pero para un uso mas amplio
  private postsUpdated = new Subject<Post[]>();

  constructor(private http : HttpClient, private router: Router) { }

  getPosts(){
    //crea un nuevo array copiando el anterior, se se pasa sin mas lo pasa por referencia
    // return [...this.posts]

    //http.get o post devuelve un Observable, al cual nos subscribimos
    this.http.get<{message:string; posts : any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return{
          title: post.title,        
          content: post.content,
          id: post._id,
          imagePath : post.imagePath
        }
      })
    }))
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    //devuelve un objeto que podemos escuchar pero no usar para emitir
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    //devuelve el post(como referencia) cuya id coincida con la que nos pasan
    // return {...this.posts.find(p => p.id === id)};
    console.log("metodo getPost" + id);
    return this.http.get<{_id : string, title:string, content:string, imagePath : string}>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image : File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
    .post<{message:string, post:Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      const post : Post = {id : responseData.post.id, title : title, content: content, imagePath: responseData.post.imagePath }
      //con el id del post nuevo que hemos insertado en la BD
      //actualizamos el array de posts para que se actualice la pagina automaticamente
   
      this.posts.push(post);
      //emite un nuevo un valor que es una copia del array de posts
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/",]);
    });
 
  }

  updatePost(id:string, title:string,content:string, image: File | string){
    let postData : Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content",content);
      postData.append("image", image, title);
    }else{
      postData = {id: id, title: title, content: content, imagePath: image};
    }

    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post : Post = {id: id, title: title, content: content, imagePath: ""}
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId : string){
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      //filtra los elementos de un array
      // si va devolviendo true en la funcion
      //se mantiene en el nuevo array, si no se elimina
      //en este caso devuelve todos salvo el post con el id 
      //que le estamos pasando
      const UpdatedPosts =  this.posts.filter(post => post.id !== postId);
      this.posts = UpdatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }
}
