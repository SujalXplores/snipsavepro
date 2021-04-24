import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginGuard } from './security/login.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'nav',
    canActivate: [LoginGuard],
    component: NavbarComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'categories', component: CategoriesComponent },
    ]
  },
  { path: 'pagenotfound', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/pagenotfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
