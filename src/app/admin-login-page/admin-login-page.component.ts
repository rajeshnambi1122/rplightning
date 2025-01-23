import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.css']
})
export class AdminLoginPageComponent {
  username: string = '';
  password: string = '';
  usernameError: string = '';
  passwordError: string = '';
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // onSubmit() {
  //   console.log('Username:', this.username);
  //   console.log('Password:', this.password); // For debugging purposes only; remove in production
  // }
  // username: string = '';
  // password: string = '';

  constructor(private http: HttpClient,private router: Router) {}
  onSubmit() {
    // Reset error messages
    this.usernameError = '';
    this.passwordError = '';

    // Validate username
    if (!this.username) {
      this.usernameError = 'Please enter your username.';
    }

    // Validate password
    if (!this.password) {
      this.passwordError = 'Please enter your password.';
    }

    // Stop submission if there are validation errors
    if (this.usernameError || this.passwordError) {
      return;
    }

    // Example API endpoint
    const loginData = {
      username: this.username,
      password: this.password
    };

    this.router.navigate(['admin-portal']);
    // const apiUrl = 'https://example.com/api/login';

    // this.http.post(apiUrl, loginData).subscribe(
    //   (response) => {
    //     console.log('Login successful:', response);
    //     // Redirect or show success message
    //   },
    //   (error) => {
    //     console.error('Login failed:', error);
    //     alert('Login failed. Please check your credentials and try again.');
    //   }
    // );
  }
  // onSubmit() {
  //   if (!this.username || !this.password) {
  //     alert('Please enter both username and password.');
  //     return;
  //   }

  //   const loginData = {
  //     username: this.username,
  //     password: this.password
  //   };

  //   // Example API endpoint
  //   const apiUrl = 'https://example.com/api/login';

  //   this.http.post(apiUrl, loginData).subscribe(
  //     (response) => {
  //       console.log('Login successful:', response);
  //       // Redirect or show success message
  //     },
  //     (error) => {
  //       console.error('Login failed:', error);
  //       alert('Login failed. Please check your credentials and try again.');
  //     }
  //   );
  // }
}
