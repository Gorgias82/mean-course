import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/shared/models/post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

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
  form !: FormGroup;
  imagePreview : string = '';
  private authStatusSub : Subscription;
  //se puede escuchar el evento desde el componente padre
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService : AuthService ) { 

  }

  ngOnInit(): void {

    //esto recoje si el usuario esta autenticado
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null, {validators : [Validators.required, Validators.minLength(3)]}),
      'content' : new FormControl(null, {validators : [Validators.required]}),
      'image' : new FormControl(null, {validators : [Validators.required], asyncValidators : [mimeType]})
    });
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
          this.post = {id : postData._id, title:postData.title, content:postData.content, imagePath : postData.imagePath, creator:postData.creator};
        });
        this.form.setValue({'title': this.post.title, 'content' : this.post.title, 'image': this.post.imagePath});
        console.log(this.post);
      }else{
        this.mode = 'create';
        this.postId = '';
      }
    });
  }
  onImagePicked(event : Event){
    const input = ((event.target as unknown )as HTMLInputElement);
    const file =  input.files?.item(0);
    this.form.patchValue({'image' : file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview  = reader.result as string;
    };
   
      reader.readAsDataURL(file as Blob);
    
   
  }

  // si hubiesemos añadido una referencia en el html con # la podemos recoger asi postInput : HTMLTextAreaElement
  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.isLoading = false;
      console.log("añade")
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }else{
      this.isLoading = false;
      console.log("edita")
      this.postsService.updatePost(this.postId,this.form.value.title, this.form.value.content, this.form.value.image);
    }
    // const post : Post = {title: form.value.title, content: form.value.content};
   
    this.form.reset();
  }

}
