import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reward-dialog',
  templateUrl: './reward-dialog.component.html',
  styleUrls: ['./reward-dialog.component.css']
})
export class RewardDialogComponent {
  days = [
    { status: 'available', rewardAmount: '10', timer: null },  // Day 1
    { status: 'locked', rewardAmount: '20', timer: null },     // Day 2
    { status: 'locked', rewardAmount: '30', timer: null },     // Day 3
    { status: 'locked', rewardAmount: '40', timer: null },     // Day 4
    { status: 'locked', rewardAmount: '50', timer: null },     // Day 5
    { status: 'locked', rewardAmount: '60', timer: null },     // Day 6
    { status: 'locked', rewardAmount: '70', timer: null },     // Day 7
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RewardDialogComponent>,
    private http: HttpClient
  ) {}

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

    this.http.post('YOUR_API_URL_HERE', rewardData).subscribe(
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
