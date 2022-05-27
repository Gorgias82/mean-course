import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';
import { PostsService } from '../posts.service';
import { subscribeOn, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [{title: 'First post', content: "First post content"},
  // {title: 'Second post', content: "Second post content"},
  // {title: 'Third post', content: "Third post content"}];
  // posts = [{title: 'First post', content: "First post content"},
  // {title: 'Second post', content: "Second post content"},
  // {title: 'Third post', content: "Third post content"}];
  posts: Post[] = [];
  private postsSub!: Subscription;
  isLoading = false;
  totalPosts : number = 0;
  postsPerPage : number = 2;
  currentPage : number = 1;
  pageSizeOptions : number[] = [1,2,5, 10];
  constructor(public postsService : PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    //subscribe recibe una funcion que a su vez
    //recibe tres argumentos(que seran tres funciones) cuando se emite un dato, cuando hay un error
    // y cuando no espera mas valores
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    //guardamos la subscription en una variable para que no siga viva
    //cuando el componente no sea parte del DOM
    this.postsSub =  this.postsService.getPostUpdateListener()
    .subscribe((postData : {posts: Post[], postCount: number } ) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
  }
  onChangedPage(pagedata : PageEvent){
    this.currentPage = pagedata.pageIndex +1;
    this.postsPerPage = pagedata.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postid : string){
    this.isLoading = true;
    this.postsService.deletePost(postid).subscribe(() =>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy(): void {
    //para prevenir fugas de memoria(memory leaks)
    // nos desuscribimos del observable
    this.postsSub.unsubscribe();
  }

}
