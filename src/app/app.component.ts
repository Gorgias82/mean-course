import { Component } from '@angular/core';
import { Post } from './shared/models/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts :Post[] = [];

  onPostAdded(post : Post){
    this.storedPosts.push(post);
  }
}
