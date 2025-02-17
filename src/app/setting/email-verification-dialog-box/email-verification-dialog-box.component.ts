import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-verification-dialog-box',
  templateUrl: './email-verification-dialog-box.component.html',
  styleUrls: ['./email-verification-dialog-box.component.css']
})
export class EmailVerificationDialogBoxComponent {
  emailForm: FormGroup;
  isOtpVisible = false;
  responseMessage: string = '';
  isCompleteEnabled = false;
  isVerified = false; // New state to track verification
  userEmail = ''; // Store email
  Chat_ID: any;
   apiUrl1 = environment.apiurl;
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    // Watch OTP field changes
    this.emailForm.get('otp')?.valueChanges.subscribe(value => {
      this.isCompleteEnabled = value && value.length === 6;
    });
  }

  ngOnInit(){
    this.Chat_ID = localStorage.getItem('Identification');
    this.getUserDetails();
  }
  getUserDetails() {
    const url = `${this.apiUrl1}webhook/getUserDetail/${this.Chat_ID}`;
  
    this.http.get<any>(url, this.getHeaders()).subscribe((result) => {
      if (result) {
        if (result.emailVerify) { 
          this.isVerified = true; // If mail is already verified, show only the verified message
          this.userEmail = result.emailId; // Store the verified email
        } else {
          this.isVerified = false; // Show the verification flow
        }
      }
    }, error => {
      console.error('Error fetching user details:', error);
      this.isVerified = false; // Default to false in case of an error
    });
  }
  verifyEmail() {
    if (this.emailForm.get('email')?.valid) {
      this.userEmail = this.emailForm.get('email')?.value;
      
      // Disable the Verify button
      this.emailForm.get('email')?.disable(); 
  
      var headers_object = new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      });
      const httpOptions = { headers: headers_object };
      let url = this.apiUrl1 + `webhook/genarete-otp/` + this.userEmail + "/" + this.Chat_ID;
  
      this.http.post(url, {}, { responseType: 'text' }).subscribe({
        next: (response: any) => {
          this.responseMessage = `Verification Successful: ${JSON.stringify(response)}`;
          console.log("response -->", this.responseMessage);
  
          if (response === 'Mail Triggered Successfully') {
            this.isOtpVisible = true;
          }
        },
        error: (error) => {
          console.error('Error:', error);
  
          // Re-enable the Verify button if API fails
          this.emailForm.get('email')?.enable();
          alert('Failed to send OTP. Please try again.');
        }
      });
    }
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });
    return { headers };
  }
  completeVerification() {
    const requestData = {
      email: this.emailForm.get('email')?.value,
      otp: this.emailForm.get('otp')?.value
    };
    const url = `${this.apiUrl1}webhook/verify/${this.emailForm.get('otp')?.value}/${this.emailForm.get('email')?.value}`;
    this.http.get(url, this.getHeaders()).subscribe(
      (response: any) => {
        console.log('Verification successful:', response);
        this.isVerified = true; // Mark as verified
        this.getUserDetails();
      },
      (error) => {
        console.error('Verification failed:', error);
        alert('Invalid OTP, please try again.');
      }
    );
  }
}
