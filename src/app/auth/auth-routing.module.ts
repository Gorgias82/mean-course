import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login/login.component";
import { SignupComponent } from "./signup/signup/signup.component";

const routes : Routes = [
    { path: 'login', component:LoginComponent},
    { path: 'signup', component:SignupComponent}
];

@NgModule({
    imports: [
        //registramos hijos de las rutas que se fusionaran con las rutas principales
        RouterModule.forChild(routes)

    ]
})
export class AuthRoutingModule {}