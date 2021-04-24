import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  hide: boolean = true;
  constructor(
    private titleService: Title,
    private _router: Router,
    private toast: HotToastService,
    private _auth: AngularFireAuth
  ) {
    this.titleService.setTitle("Create Account");
    this.signupForm = new FormGroup({
      u_email_id: new FormControl(null, [Validators.required, Validators.email]),
      u_password: new FormControl(null, [Validators.required]),
      u_confirm_password: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void { }

  onSignup() {
    const email = this.signupForm.value.u_email_id;
    const password = this.signupForm.value.u_password;
    const confirm_password = this.signupForm.value.u_confirm_password;
    if (password == confirm_password && this.signupForm.valid) {
      this._auth.createUserWithEmailAndPassword(email, password).then(() => {
        this.SendVerificationMail();
        this._router.navigate(['']);
        this.toast.success("Varification link sent on " + email, {
          theme: 'snackbar',
          id: 'signup',
          position: 'bottom-center'
        });
      }, (e) => {
        this.toast.error(e.message, {
          theme: 'snackbar',
          id: 'error',
          position: 'bottom-center'
        });
      });
    } else {
      this.toast.error("Invalid email/password", {
        theme: 'snackbar',
        id: 'error',
        position: 'bottom-center'
      });
    }
  }

  async SendVerificationMail() {
    (await this._auth.currentUser).sendEmailVerification().then(() => {
      console.log('email sent');
    });
  }
}
