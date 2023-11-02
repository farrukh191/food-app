import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  validateForm!: FormGroup;
  isLoginMode!: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loginServiceCalled();
  }

  loginServiceCalled() {
    this.isLoginMode = false;
    this.initializeForm();
    this.authService.autoLogin();
  }

  get acntBtnChange() {
    return this.isLoginMode ? 'Sign Up' : 'Login';
  }
  get switchBtnChange() {
    return !this.isLoginMode ? 'Sign Up' : 'Login';
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      // console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    // if user authentication is valid like this.validateForm.valid that it can be enter if block
    if (!this.isLoginMode) {
      this.authService
        .login(this.validateForm.value.email, this.validateForm.value.password)
        .subscribe({
          next: (res: any) => {
            this.authService.handleAuthentication(
              res.email,
              res.localId,
              res.idToken,
              res.expiresIn
            );
            this.route.navigate(['./dashboard']);
            // here we will get the reesponse from the user when user enter correct credential
          },
          error: (errorMessage) => {
            // return errorMessage;
            const obs = throwError(() => new Error(errorMessage));
          },
        });
    } else {
      this.authService
        .signup(this.validateForm.value.email, this.validateForm.value.password)
        .subscribe({
          next: (res) => {
            return res;
          },
          error: (errorMessage) => {
            const obs = throwError(() => new Error(errorMessage));
          },
        });
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.setSignUpControl();
    } else {
      this.setLoginControl();
    }
  }

  initializeForm() {
    this.validateForm = this.fb.group({
      userName: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null],
      // remember: [true]
    });
  }

  setSignUpControl() {
    this.isLoginMode = true;
    this.setControlValidator('userName', [Validators.required]);
    this.setControlValidator('confirmPassword', [Validators.required]);
  }
  setLoginControl() {
    this.isLoginMode = false;
    this.clearControlValidator('userName');
    this.clearControlValidator('confirmPassword');
  }
  setControlValidator(
    controlName: string,
    validators: ValidatorFn | ValidatorFn[] | null
  ) {
    this.validateForm.controls[controlName].setValidators(validators);
  }

  clearControlValidator(controlName: string) {
    this.validateForm.controls[controlName].clearValidators();
  }
}
