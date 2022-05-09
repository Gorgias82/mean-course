import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';

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
  @Output() postCreated = new EventEmitter<Post>();
  constructor() { }

  ngOnInit(): void {
  }
  // si hubiesemos añadido una referencia en el html con # la podemos recoger asi postInput : HTMLTextAreaElement
  onAddPost(){
    const post : Post = { title: this.enteredTitle, content: this.enteredContent};
    this.postCreated.emit(post);
  }

}
