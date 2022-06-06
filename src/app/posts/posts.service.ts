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
  private postsUpdated = new Subject<{ posts: Post[], postCount : number}>();

  constructor(private http : HttpClient, private router: Router) { }

  getPosts(postsPerPage : number, currentPage: number){
    //crea un nuevo array copiando el anterior, se se pasa sin mas lo pasa por referencia
    // return [...this.posts]

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    //http.get o post devuelve un Observable, al cual nos subscribimos
    this.http.get<{message:string; posts : any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    //añade el count de los posts con una pipe
    //y modificando el array de posts con el metodo map
    .pipe(map((postData) => {
      return { posts:  postData.posts.map(post => {
        return{
          title: post.title,        
          content: post.content,
          id: post._id,
          imagePath : post.imagePath,
          creator: post.creator
        }
      }), maxPosts : postData.maxPosts
    };
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts:  [...this.posts], postCount : transformedPostData.maxPosts});
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
    return this.http.get<{_id : string, title:string, content:string, imagePath : string, creator : string}>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image : File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
    .post<{message:string, post:Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {   
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
      postData = {id: id, title: title, content: content, imagePath: image, creator: null};
    }

    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/",]);
      });
  }

  deletePost(postId : string){
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
    
   
  }
}
