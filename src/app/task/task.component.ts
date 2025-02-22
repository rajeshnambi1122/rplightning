import { Component } from '@angular/core';
import { RewardDialogComponent } from './reward-dialog/reward-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WheelFortuneComponent } from '../wheel-fortune/wheel-fortune.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { RewardDialogComponentComponent } from './reward-dialog-component/reward-dialog-component.component';

interface TaskCard {
  img: string;
  name: string;
  button: string;
  link: string;
  isClaimed: boolean;
  isStarted: boolean;
  apiEndpoint: string;
  verificationUrl: string;
  rewardAmount: number;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  selectedTab: string = 'tasks';
  Chat_ID: any;
  apiUrl = environment.apiurl;
  userDetails: any;
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
  cardData: TaskCard[] = [
    {
      img: 'assets/Youtube.jpg',
      name: 'YouTube',
      button: 'Start',
      link: 'https://example.com', // The link to open on "Start" click
      isClaimed: false, // Flag to track whether "Claim" button should be shown
      isStarted: false, // Track if "Start" has been clicked
      apiEndpoint: 'https://your-api-endpoint/claim-reward', // Add API endpoint
      verificationUrl: 'https://your-api-endpoint/verify-youtube',
      rewardAmount: 10, // Add reward amount for each task
    },
    {
      img: 'data:image/jpeg;base64,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',
      name: 'X',
      button: 'Start',
      link: 'https://x.com/Lighting_app?t=jc2u8bIyYZ0q2CR-3ZRtVg&s=09',
      isClaimed: false,
      isStarted: false,
      apiEndpoint: 'https://your-api-endpoint/claim-reward',
      verificationUrl: 'https://your-api-endpoint/verify-twitter',
      rewardAmount: 10, // Add reward amount for each task
    },
    {
      img: 'assets/Instagram.jpg',
      name: 'Instagram',
      button: 'Start',
      link: 'https://www.instagram.com/lightingapp2/profilecard/?igsh=cHc5dWFseGJjOThy',
      isClaimed: false,
      isStarted: false,
      apiEndpoint: 'https://your-api-endpoint/claim-reward',
      verificationUrl: 'https://your-api-endpoint/verify-instagram',
      rewardAmount: 10, // Add reward amount for each task
    },
    {
      img: 'assets/telegram1.jpg',
      name: 'Telegram',
      button: 'Start',
      link: 'https://t.me/lightning2010',
      isClaimed: false,
      isStarted: false,
      apiEndpoint: 'https://your-api-endpoint/claim-reward',
      verificationUrl: 'https://your-api-endpoint/verify-telegram',
      rewardAmount: 10, // Add reward amount for each task
    },
    // https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg --> insta
    // https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg -- Tele
  ];

  rewards = [
    { day: 1, amount: 10 },
    { day: 2, amount: 20 },
    { day: 3, amount: 30 },
    { day: 4, amount: 40 },
    { day: 5, amount: 50 },
    { day: 6, amount: 60 },
    { day: 7, amount: 70 },
  ];
  currentDay = 1; // Tracks the current reward day
  isDayAvailable = true; // Set true for initial availability
  remainingTime = '00:00:00'; // Countdown for the next reward

  constructor(private dialog: MatDialog,private http: HttpClient, private router: ActivatedRoute) {}

  // Simulate API call or logic to get availability
  // checkAvailability() {
  //   const now = new Date();
  //   const nextDayTime = new Date();
  //   nextDayTime.setDate(now.getDate() + 1); // Add 24 hours for the next day
  //   const timeDifference = nextDayTime.getTime() - now.getTime();

  //   if (timeDifference > 0) {
  //     this.isDayAvailable = false;
  //     this.startCountdown(timeDifference);
  //   } else {
  //     this.isDayAvailable = true;
  //   }
  // }

  // // Start countdown for next reward
  // startCountdown(timeDifference: number) {
  //   const interval = setInterval(() => {
  //     const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  //     const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  //     const seconds = Math.floor((timeDifference / 1000) % 60);

  //     this.remainingTime = `${hours}:${minutes}:${seconds}`;
  //     timeDifference -= 1000;

  //     if (timeDifference <= 0) {
  //       clearInterval(interval);
  //       this.isDayAvailable = true;
  //     }
  //   }, 1000);
  // }
  // isDayAvailable: boolean = false;
  // remainingTime: string = '00:00:00'; // Timer for the next reward
  // currentDay: number = 1; // Track the current day
  // rewards = [
  //   { amount: 10 }, // Day 1
  //   { amount: 20 }, // Day 2
  //   { amount: 30 }, // Day 3
  //   { amount: 40 }, // Day 4
  //   { amount: 50 }, // Day 5
  //   { amount: 60 }, // Day 6
  //   { amount: 70 }, // Day 7
  // ];

  // constructor(private dialog: MatDialog, private rewardService: RewardService) {}

  ngOnInit(): void {
    this.Chat_ID = localStorage.getItem('Identification')
    this.getUserDetails();

  }
    private getHeaders() {
      const headers = new HttpHeaders({
        'ngrok-skip-browser-warning': '69420'
      });
      return { headers };
    }
    getUserDetails() {
      const url = `${this.apiUrl}webhook/getUserDetail/${this.Chat_ID}`;
  
  
      this.http.get<any>(url, this.getHeaders()).subscribe((result) => {
        if (result) {
          console.log("GET API RESPONCE --->", result)
          this.userDetails = result
          this.checkAvailability();
          this.startTimer();
          // console.log("BEFORE savedProgress --->", this.userDetails.miningProgress)
          console.log("this.userDetails --->", this.userDetails)
          // this.profile.balance = result.balance ? parseFloat(result.balance) : 0;
          
        } else {
          console.error("Refferal ID not found in response", result);
        }
      });
    }
  // }
  // checkAvailability() {
  //   const currentTime = new Date();
  //   const lastClaimTime = localStorage.getItem('lastClaimTime');
  //   if (lastClaimTime) {
  //     const elapsedTime = Math.floor((currentTime.getTime() - new Date(lastClaimTime).getTime()) / 1000);
  //     const remainingTime = 86400 - elapsedTime; // 86400 seconds in a day
  //     this.remainingTime = new Date(remainingTime * 1000).toISOString().substr(11, 8);
  //     this.isDayAvailable = remainingTime <= 0;
  //   } else {
  //     this.isDayAvailable = true;
  //   }
  // }

  // // Start the timer that checks availability every second
  // startTimer() {
  //   setInterval(() => {
  //     this.checkAvailability();
  //   }, 1000); // Update every second
  // }
  // Method to open the link and start the task
  openLinkAndEnableClaimButton(index: number) {
    const card = this.cardData[index];

    // Open the link in a new tab
    window.open(card.link, '_blank');

    // Mark as started
    card.isStarted = true;
    card.button = 'Verify'; // Change button text to 'Verify' instead of directly to 'Claim'
  }

  // Method to verify and claim the reward
  claimReward(index: number) {
    const card = this.cardData[index];

    if (!card.isStarted) {
      alert('Please start the task first');
      return;
    }

    // Show loading state
    card.button = 'Verifying...';

    // First verify the task completion
    this.verifyTaskCompletion(card).subscribe({
      next: (isVerified) => {
        if (isVerified) {
          // Task verified successfully
          card.button = 'Claiming...';

          // Call API to claim the reward
          this.http
            .post(card.apiEndpoint, {
              taskType: card.name.toLowerCase(),
              userId: 'current-user-id', // Get this from your auth service
            })
            .subscribe({
              next: (response: any) => {
                card.isClaimed = true;
                card.button = 'Claimed ✓';
                // Update user's token balance
                this.updateTokenBalance(response.rewardAmount);
                alert(
                  `Task completed! You earned ${response.rewardAmount} tokens`
                );
              },
              error: (error) => {
                console.error('Error claiming reward:', error);
                card.button = 'Verify';
                card.isClaimed = false;
                alert('Failed to claim reward. Please try again.');
              },
            });
        } else {
          // Task not completed
          card.button = 'Verify';
          alert(`Please complete the ${card.name} task before verifying`);
        }
      },
      error: (error) => {
        console.error('Error verifying task:', error);
        card.button = 'Verify';
        alert('Verification failed. Please try again.');
      },
    });
  }

  private verifyTaskCompletion(card: TaskCard): Observable<boolean> {
    // For development/testing, you can use this mock implementation
    return new Observable<boolean>((observer) => {
      // Simulate API call delay
      setTimeout(() => {
        switch (card.name.toLowerCase()) {
          case 'youtube':
            // Check if user is on the YouTube page for at least 10 seconds
            observer.next(true); // Mock response
            break;
          case 'x':
            // Check if user followed on Twitter
            observer.next(true); // Mock response
            break;
          case 'instagram':
            // Check if user followed on Instagram
            observer.next(true); // Mock response
            break;
          case 'telegram':
            // Check if user joined Telegram group
            observer.next(true); // Mock response
            break;
          default:
            observer.next(false);
        }
        observer.complete();
      }, 2000); // Simulate 2-second delay
    });
  }

  // Helper method to update token balance
  private updateTokenBalance(amount: number): void {
    // Update local storage and state
    const currentBalance = parseFloat(
      localStorage.getItem('tokenBalance') || '0'
    );
    const newBalance = currentBalance + amount;
    localStorage.setItem('tokenBalance', newBalance.toString());

    // Update global state if you have one
    if (window.walletState) {
      window.walletState.tokenBalance = newBalance;
    }
  }

  // Open dialog box for reward
  // openRewardDialog() {
  //   const dialogRef = this.dialog.open(RewardDialogComponent, {
  //     width: '100%',
  //     maxWidth: '320px', // Limit dialog width to match small box layout
  //     height: 'auto',
  //     panelClass: 'reward-dialog-container',
  //     position: { top: '', bottom: '', left: '', right: '' },
  //     data: {
  //       currentDay: this.currentDay,
  //       rewardAmount: this.rewards[this.currentDay - 1].amount,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 'claimed') {
  //       this.isDayAvailable = false;
  //       this.currentDay = (this.currentDay % 7) + 1;
  //       this.checkAvailability();
  //     }
  //   });
  // }
  // Method to open the reward dialog
  // Method to open the reward dialog
  // openRewardDialog() {
  //   const dialogRef = this.dialog.open(RewardDialogComponent, {
  //     width: '100%',
  //     maxWidth: '320px', // Limit dialog width to match small box layout
  //     height: 'auto',
  //     data: {
  //       currentDay: this.currentDay,
  //       rewardAmount: this.rewards[this.currentDay - 1].amount,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 'claimed') {
  //       this.isDayAvailable = false;
  //       this.currentDay = (this.currentDay % 7) + 1; // Reset to Day 1 after 7th day
  //       this.checkAvailability();
  //     }
  //   });
  // }
  openRewardDialog() {
    const dialogRef = this.dialog.open(RewardDialogComponent, {
      width: '100%',
      maxWidth: '320px', // Limit dialog width to match small box layout
      height: 'auto',
      panelClass: 'custom-reward-dialog', // Custom class for the dialog box
      data: {
        currentDay: this.currentDay,
        rewardAmount: this.rewards[this.currentDay - 1].amount,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'claimed') {
        this.isDayAvailable = false;
        this.currentDay = (this.currentDay % 7) + 1; // Reset to Day 1 after 7th day
        this.checkAvailability();
      }
    });
  }
  // Method to check availability based on the current time
  checkAvailability() {
    const currentTime = new Date();
    const lastClaimTime = this.userDetails.dailyRewardsLastClaimTime;
    if (lastClaimTime) {
      const elapsedTime = Math.floor(
        (currentTime.getTime() - new Date(lastClaimTime).getTime()) / 1000
      );
      const remainingTime = 86400 - elapsedTime; // 86400 seconds in a day
      this.remainingTime = new Date(remainingTime * 1000)
        .toISOString()
        .substr(11, 8);
      this.isDayAvailable = remainingTime <= 0;
    } else {
      this.isDayAvailable = true;
    }
  }

  // Start the timer that checks availability every second
  startTimer() {
    setInterval(() => {
      this.checkAvailability();
    }, 1000); // Update every second
  }

  openWheelDialog() {
    const dialogRef = this.dialog.open(WheelFortuneComponent, {
      width: '350px',
      height: '450px',
      panelClass: ['wheel-dialog', 'no-padding-dialog'],
      disableClose: true,
      backdropClass: 'wheel-backdrop',
      maxHeight: '90vh',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Won reward:', result);
        // Handle the won reward
      }
    });
  }
}
