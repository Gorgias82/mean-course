import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts = [{title: 'First post', content: "First post content"},
  // {title: 'Second post', content: "Second post content"},
  // {title: 'Third post', content: "Third post content"}];
  // posts = [{title: 'First post', content: "First post content"},
  // {title: 'Second post', content: "Second post content"},
  // {title: 'Third post', content: "Third post content"}];
  @Input() posts!: Post[];
  constructor() { }

  ngOnInit(): void {
    console.log(this.posts)
  }

}
