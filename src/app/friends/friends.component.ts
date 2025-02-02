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
   apiUrl1 = environment.apiurl;
  //  @ViewChild('referralInput', { static: false }) referralInput!: ElementRef;
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
  constructor(private http: HttpClient, private router: ActivatedRoute){
    
  }
  invitedUsers = new MatTableDataSource([
    { name: 'Lighting', dateReferred: new Date(), earned: 20 },
    { name: 'Jane Smith', dateReferred: new Date('2025-01-01') , earned: 10},
  ]);

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
  getUserDetails(){
    const url = `${this.apiUrl1}webhook/getUserDetail/${this.Chat_ID}`;

   
    const headers_object = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    });
    const httpOptions = { headers: headers_object };

    // Make the GET request with the URL and the httpOptions
    this.http.get(url, httpOptions).subscribe(result => {
      console.log(result);
    });
  }

}
