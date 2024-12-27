import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Create a new account
  async createAccount(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      alert('Account created successfully!');
      this.router.navigate(['/posts']); // Navigate to posts after account creation
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Login functionality
  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      alert('Logged in successfully!');
      this.router.navigate(['/posts']); // Navigate to posts after login
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Logout functionality
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      alert('Logged out successfully!');
      this.router.navigate(['/account']); // Navigate to account after logout
    } catch (error: any) {
      alert(error.message);
    }
  }

  // Check authentication state
  getAuthState() {
    return this.afAuth.authState;
  }
}
