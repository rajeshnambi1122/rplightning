import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reward-dialog',
  templateUrl: './reward-dialog.component.html',
  styleUrls: ['./reward-dialog.component.css']
})
export class RewardDialogComponent {
  apiUrl = environment.apiurl;
  Chat_ID: any;
  days = [
    { status: 'available', rewardAmount: '2', timer: null },  // Day 1
    { status: 'locked', rewardAmount: '4', timer: null },     // Day 2
    { status: 'locked', rewardAmount: '6', timer: null },     // Day 3
    { status: 'locked', rewardAmount: '8', timer: null },     // Day 4
    { status: 'locked', rewardAmount: '10', timer: null },     // Day 5
    { status: 'locked', rewardAmount: '12', timer: null },     // Day 6
    { status: 'locked', rewardAmount: '14', timer: null },     // Day 7
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RewardDialogComponent>,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.Chat_ID = localStorage.getItem('Identification')
  }

  // Called when a user clicks the claim button
  onClaim(day: any, index: number) {
    if (day.status === 'available') {
      this.claimReward(day, index);
    }
  }

  // API call to claim the reward
  claimReward(day: any, index: number) {
    const rewardData = {
      day: index + 1,  // Day number (1-7)
      rewardAmount: day.rewardAmount,
    };
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpOptions = { headers: headers_object };
    this.http.put<any>(this.apiUrl + "webhook/balanceUpdate/" + this.Chat_ID + "/" + day.rewardAmount, {}, httpOptions).subscribe(
      (response) => {
        console.log(`Reward claimed for Day ${index + 1}:`, response);
        day.status = 'done'; // Update the status after successful claim
        localStorage.setItem('lastClaimTime', new Date().toISOString()); // Store the claim time
        this.dialogRef.close('claimed');
      },
      (error) => {
        console.error('Error claiming reward:', error);
        // Optionally show error message in the UI
      }
    );
  }
  // days = [
  //   { status: 'done', rewardAmount: '4827', rewardRange: null, timer: null }, // Day 1
  //   { status: 'locked', rewardAmount: null, rewardRange: '1K-40K', timer: '13:48:33' }, // Day 2
  //   { status: 'locked', rewardAmount: null, rewardRange: '1K-40K', timer: null }, // Day 3
  //   { status: 'locked', rewardAmount: null, rewardRange: '1K-40K', timer: null }, // Day 4
  //   { status: 'locked', rewardAmount: null, rewardRange: '1K-40K', timer: null }, // Day 5
  //   { status: 'locked', rewardAmount: null, rewardRange: '1K-40K', timer: null }, // Day 6
  //   { status: 'locked', rewardAmount: null, rewardRange: '1K-40K', timer: null }, // Day 7
  // ];

  // constructor(
  //   @Inject(MAT_DIALOG_DATA) public data: any,
  //   private dialogRef: MatDialogRef<RewardDialogComponent>
  // ) {}

  // onClaim(day: any, index: number) {
  //   if (day.status === 'available') {
  //     console.log(`Day ${index + 1} reward claimed: ${day.rewardAmount}`);
  //     day.status = 'done'; // Simulate claiming the reward
  //   }
  // }
}
