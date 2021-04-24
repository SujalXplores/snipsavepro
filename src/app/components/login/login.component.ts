import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide: boolean = true;
  constructor(
    private titleService: Title,
    private _router: Router,
    private toast: HotToastService,
    private _auth: AngularFireAuth
  ) {
    this.titleService.setTitle("Login");
    this.loginForm = new FormGroup({
      u_email_id: new FormControl(null, [Validators.required, Validators.email]),
      u_password: new FormControl(null, [Validators.required]),
    });
  }

  async onLogin() {
    (await this._auth.currentUser).reload();
    const email = this.loginForm.value.u_email_id;
    const password = this.loginForm.value.u_password;
    if (this.loginForm.valid) {
      if ((await this._auth.currentUser).emailVerified) {
        this._auth.signInWithEmailAndPassword(email, password).then(() => {
          localStorage.setItem('id', email);
          this._router.navigate(['/nav/home']);
          this.toast.success("Login Successful", {
            theme: 'snackbar',
            id: 'login',
            position: 'bottom-center'
          });
        }, (e) => {
          if (e.code == 'auth/user-not-found') {
            this.toast.error('Create account first', {
              theme: 'snackbar',
              id: 'error',
              position: 'bottom-center'
            });
          } else if (e.code == 'auth/wrong-password') {
            this.toast.error('Password is Invalid.', {
              theme: 'snackbar',
              id: 'error',
              position: 'bottom-center'
            });
          }
        });
      } else {
        this.toast.error('Please verify your email', {
          theme: 'snackbar',
          id: 'error',
          position: 'bottom-center'
        });
      }
    }
  }
}
