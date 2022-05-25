import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/shared/models/post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId !: string ;
  post !: any;
  newPost = 'NO CONTENT';
  isLoading = false;
  //se puede escuchar el evento desde el componente padre
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = false;
    //escucha los cambios en la url
    this.route.paramMap.subscribe((paramMap : ParamMap) => {
      //el nombre del parametro viene en app-routing
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || '';
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id : postData._id, title:postData.title, content:postData.content};
        });
        console.log(this.post);
      }else{
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  // si hubiesemos añadido una referencia en el html con # la podemos recoger asi postInput : HTMLTextAreaElement
  onSavePost(form : NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.isLoading = false;
      console.log("añade")
      this.postsService.addPost(form.value.title, form.value.content);
    }else{
      this.isLoading = false;
      console.log("edita")
      this.postsService.updatePost(this.postId,form.value.title, form.value.content);
    }
    // const post : Post = {title: form.value.title, content: form.value.content};
   
    form.resetForm();
  }

}
