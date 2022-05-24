import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  newPost = 'NO CONTENT';
  //se puede escuchar el evento desde el componente padre
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
  }
  // si hubiesemos añadido una referencia en el html con # la podemos recoger asi postInput : HTMLTextAreaElement
  onAddPost(form : NgForm){
    if(form.invalid){
      return;
    }
    const post : Post = { title: form.value.title, content: form.value.content};
    this.postsService.addPost(post);
    form.resetForm();
  }

}
