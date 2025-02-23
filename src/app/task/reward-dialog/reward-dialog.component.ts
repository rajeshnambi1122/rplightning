import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared.service';
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
    private http: HttpClient,
    private refreshService: SharedService,
  ) { }

  // ngOnInit() {
  //   this.Chat_ID = localStorage.getItem('Identification')
  //   this.checkRewardStatus();
  // }
  ngOnInit() {
    this.Chat_ID = localStorage.getItem('Identification');
    this.checkRewardStatus();
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });
    return { headers };
  }
  // Check reward status based on last claim time
  checkRewardStatus() {
    const url = `${this.apiUrl}webhook/getUserDetail/${this.Chat_ID}`;
    this.http.get<any>(url, this.getHeaders()).subscribe(
      (response) => {
        console.log()
        const lastClaimTime = response.dailyRewardsLastClaimTime;  // Assuming this is in ISO format (e.g., "2025-02-14T10:30:00Z")
        if (lastClaimTime) {
          const elapsedTime = this.calculateElapsedTime(lastClaimTime);
          this.updateDaysStatus(elapsedTime);
        } else {
          // If no last claim time, only Day 1 is available
          this.days[0].status = 'available';
        }
      },
      (error) => {
        console.error('Error fetching last claim time:', error);
      }
    );
  }

  // Calculate the elapsed time in hours since the last claim
  calculateElapsedTime(lastClaimTime: string): number {
    const lastClaimDate = new Date(lastClaimTime).getTime();
    const currentDate = new Date().getTime();
    const elapsedTime = (currentDate - lastClaimDate) / (1000 * 60 * 60); // Convert milliseconds to hours
    return elapsedTime;
  }

  // Update the status of each day based on the elapsed time
  updateDaysStatus(elapsedTime: number) {
    const dayIndex = Math.floor(elapsedTime / 24);  // Each day becomes available after 24 hours
    if (dayIndex >= 7) {
      this.resetDays();  // If more than 7 days, reset to Day 1
    } else {
      for (let i = 0; i <= dayIndex; i++) {
        this.days[i].status = i === dayIndex ? 'available' : 'done';  // Mark previous days as done, current day as available
      }
    }
  }

  // Reset all days to initial state after 7 days
  resetDays() {
    this.days.forEach((day, index) => {
      day.status = index === 0 ? 'available' : 'locked';
    });
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
    this.http.put<any>(this.apiUrl + "webhook/balanceUpdate/" + this.Chat_ID + "/" + day.rewardAmount+ "/1", {}, httpOptions).subscribe(
      (response) => {
        this.refreshService.triggerRefresh();
        console.log(`Reward claimed for Day ${index + 1}:`, response);
        day.status = 'done'; // Update the status after successful claim
        // localStorage.setItem('lastClaimTime', new Date().toISOString()); // Store the claim time
        this.http.put<any>(this.apiUrl + "webhook/lastDateUpdate/" + this.Chat_ID + "/" + new Date().toISOString()+'/1', {}, httpOptions).subscribe(
          (response) => {
            // console.log(`Reward claimed for Day ${index + 1}:`, response);
            // day.status = 'done'; // Update the status after successful claim
            // localStorage.setItem('lastClaimTime', new Date().toISOString()); // Store the claim time
            // webhook/lastDateUpdate
            this.dialogRef.close('claimed');
            this.checkRewardStatus();
          },
          (error) => {
            console.error('Error claiming reward:', error);
            // Optionally show error message in the UI
          }
        )
        // webhook/lastDateUpdate
      
      },
      (error) => {
        console.error('Error claiming reward:', error);
        // Optionally show error message in the UI
      }
    );
  }
}
