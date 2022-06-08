import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '', component:PostListComponent},
  { path: 'create', component:PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component:PostCreateComponent, canActivate: [AuthGuard]},
  //este se hace para gestionar el lazy loading, se crea otro fichero de routing
  //en el modulo donde esten las rutas que queremos gestionar con lazy loading
  //se añade algo delante auth en este caso para que identifique el modulo
  //esto hace que estos componentes no se carguen al inicio siempre
  //si no solo cuando se vayan a usar
  { path : "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
