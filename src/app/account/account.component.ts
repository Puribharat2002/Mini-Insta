import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  accountForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email validator added here
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''], // Will be removed in login mode
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;

    if (this.isLoginMode) {
      this.accountForm.removeControl('confirmPassword');
    } else {
      this.accountForm.addControl(
        'confirmPassword',
        this.fb.control('', [Validators.required])
      );
    }

    // Reset form when toggling modes
    this.accountForm.reset();
    this.errorMessage = '';
  }

  async onSubmit() {
    if (this.accountForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const { email, password, confirmPassword } = this.accountForm.value;

    if (!this.isLoginMode && password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isLoginMode) {
        // Login
        await this.auth.signInWithEmailAndPassword(email, password);
      } else {
        // Create account
        await this.auth.createUserWithEmailAndPassword(email, password);
      }

      // Navigate to posts page on success
      this.router.navigate(['/posts']);
    } catch (error: any) {
      this.errorMessage = this.isLoginMode
        ? `Login failed: ${error.message}`
        : `Account creation failed: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }
}
