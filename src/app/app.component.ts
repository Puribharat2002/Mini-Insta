import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  userName: string | null = null; // Store the logged-in user's name
  dropdownOpen: boolean = false; // Control the dropdown visibility

  constructor(private auth: AngularFireAuth, private router: Router) {
    // Check login state
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userName = user.displayName || user.email; // Display name or email
      } else {
        this.userName = null;
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/']); // Redirect to login
      this.userName = null;
      this.dropdownOpen = false; // Close dropdown
    });
  }
}
