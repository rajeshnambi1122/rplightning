import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent {
  selectedTab: string = 'invite';
  Chat_ID: any;
  ReferealData: any;
   apiUrl1 = environment.apiurl;
   // Define the expected structure for invitedUsers
invitedUsers: { username: string; balance: number; createdAt: Date }[] = [];
  res: any;
  //  @ViewChild('referralInput', { static: false }) referralInput!: ElementRef;
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
  constructor(private http: HttpClient, private router: ActivatedRoute){
    
  }


  @ViewChild('referralInput', { static: false }) referralInput!: ElementRef;

  copyLink() {
    const link = this.referralInput.nativeElement.value; // ✅ Correctly accessing the value
    navigator.clipboard.writeText(link).then(() => {
      alert('Referral link copied: ' + link);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
  ngOnInit(): void {
    // Set initial state
    this.Chat_ID = localStorage.getItem('Identification');
    console.log("this.Chat_ID --->",this.Chat_ID)
    this.getUserDetails();
    
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning':  '69420'
    });
    return {headers};
  }
  getUserDetails(){
    const url = `${this.apiUrl1}webhook/getUserDetail/${this.Chat_ID}`;


    this.http.get<any>(url, this.getHeaders()).subscribe((result) => {
      if (result && result.refferalId) {
        this.ReferealData = result.refferalId;
        this.getReferedUserDetails(this.ReferealData);
        console.log("Refferal ID:", this.ReferealData);
      } else {
        console.error("Refferal ID not found in response", result);
      }
    });
  }


getReferedUserDetails(refferalId: string) {
    const url = `${this.apiUrl1}webhook/getRefferal/${refferalId}`;

    this.http.get<any[]>(url, this.getHeaders()).subscribe((result) => {
      if (result && result.length > 0) {
        // Transform API response to match table structure
        this.invitedUsers = result.map(user => ({
          username: user.username || 'N/A',  // Handle undefined username
          balance: user.balance ?? 0,  // Default to 0 if balance is null or undefined
          createdAt: new Date(user.createdAt), // Convert to Date object
        }));

        console.log("Transformed Data:", this.invitedUsers);
      } else {
        console.error("No referred users found", result);
      }
    });
}

  

}
