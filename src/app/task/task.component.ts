import { Component } from '@angular/core';
import { RewardDialogComponent } from './reward-dialog/reward-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
// import { RewardDialogComponentComponent } from './reward-dialog-component/reward-dialog-component.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  selectedTab: string = 'tasks';

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
  cardData = [
    { 
      img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAkFBMVEX/////AAD/5+f/oKD/tLT/8vL/+Pj/5OT/2tr/+/v/0dH/pKT/7Oz/nZ3/mpr/NTX/rq7/kZH/jY3/3t7/w8P/Fhb/uLj/Kyv/Z2f/1NT/9PT/qan/lZX/vb3/fn7/bm7/WFj/Q0P/JCT/T0//eHj/SUn/iIj/DQ3/ysr/Li7/cnL/OTn/YmL/RET/XFz/goJdMJwSAAADYUlEQVR4nO3ca1faQBSF4SSEXLkEBRTCXVQUW///v2sUV1e1tZwZGafHvs/3rOXehmFykhAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgf5DnybSTnmeTYjiOq7psdbu93mw2GJw1BrPZrNfttsq6quL5bpKdp1E7SXLff/RpTLNh3FssV+v+xSg0c7u5219dbs+qedHxHcNaMl7eGeZ+z2jVinzHsdEy/ccfca/ubEjXp23gSew7lJnz0zfQKH3HMtHZOOkgHPsOZmDlpoIw1LMmDF1VEC59RxO7dtZBmPrOJpS6qyDs+g4nVDnsYOU7nNDCYQeh73BCe5cd6FgQcpcVhEPf8UQipx20fMcTKZx2sPUdTyR22sHKdzyRrtMO+r7jiWxFWS4sO9gkvvNJXIqypC27DkZt3/kkZFcLUdCWnTBvqdgg9IUdBEF2ZdFB5jufQC77pB9mpHPzYUvhOZ9EIov1MifOe6YdaNgotmXz5J+z8mhp1oGGyWrn1qyDZmNpNHOp/UUTE05QXt0ziWW9PdNwwSAcq7++b5QMxB30POUykdl00Jw+sq1VGM68pDJj2UEQ7NaiAwceMpma2HYQBLXkwLNPT2ROOD74433k5PH4gTefHcjCRzpoloWHYwc+fm4cKx/roPh27MCvfh50BF8OGjqwXxOTG8mBGtZE6+/GSnaxpeG70bKDydGF4IWGPZLVXrlzL2xAx15ZeIvl1w6MhggarpnMr53nRjNmDdfOU8MZiulQUcMMxWyW1ja+Ub/zG0/EaKZamjagY6ZqMFsf2jzLq2G2Hsg+31GQfrdo4N0LjX+LbCCUiTbGvxtNfeeTkK1ytk90b1S81WB5M1Vo7zueCM9giC+eLS18xxPpOO1AyfP7TjvQsE1srF12oGJ7EASCAbk93+GEXH4xPPgOJ+TyQVUlS6LDV3kUvczj7mldHbuDZ4aP18ipuGA6mMpmCMaUbA4O3LzgqOn1xkbbbkDyNxtVZ8Gz8Ylf6RmoeFj7rWJwfZqPxO1+O1e0Gr7Vzobj8mZ7efX0KxAGT+CNNv399cP9ohfPi0jF6EgkT5J2lB5+D2Qex1VV12VZthplWddVVcXj4a44/BDINMm/TnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPB3PwCJ/DIIowIlpwAAAABJRU5ErkJggg==", 
      name: "YouTube", 
      button: "Start", 
      link: "https://example.com",  // The link to open on "Start" click
      isClaimed: false,  // Flag to track whether "Claim" button should be shown
      isStarted: false, // Track if "Start" has been clicked
      apiEndpoint: "https://your-api-endpoint/claim-reward" // Add API endpoint
    },
    { 
      img: "data:image/jpeg;base64,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", 
      name: "X", 
      button: "Start", 
      link: "https://x.com/Lighting_app?t=jc2u8bIyYZ0q2CR-3ZRtVg&s=09", 
      isClaimed: false,
      isStarted: false,
      apiEndpoint: "https://your-api-endpoint/claim-reward"
    },
    { 
      img: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg", 
      name: "Instagram", 
      button: "Start", 
      link: "https://www.instagram.com/lightingapp2/profilecard/?igsh=cHc5dWFseGJjOThy", 
      isClaimed: false,
      isStarted: false,
      apiEndpoint: "https://your-api-endpoint/claim-reward"
    },
    { 
      img: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg", 
      name: "Telegram", 
      button: "Start", 
      link: "https://t.me/lightning2010", 
      isClaimed: false,
      isStarted: false,
      apiEndpoint: "https://your-api-endpoint/claim-reward"
    }
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

  constructor(private dialog: MatDialog,private http: HttpClient) {}

  // Simulate API call or logic to get availability
  checkAvailability() {
    const now = new Date();
    const nextDayTime = new Date();
    nextDayTime.setDate(now.getDate() + 1); // Add 24 hours for the next day
    const timeDifference = nextDayTime.getTime() - now.getTime();

    if (timeDifference > 0) {
      this.isDayAvailable = false;
      this.startCountdown(timeDifference);
    } else {
      this.isDayAvailable = true;
    }
  }

  // Start countdown for next reward
  startCountdown(timeDifference: number) {
    const interval = setInterval(() => {
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      this.remainingTime = `${hours}:${minutes}:${seconds}`;
      timeDifference -= 1000;

      if (timeDifference <= 0) {
        clearInterval(interval);
        this.isDayAvailable = true;
      }
    }, 1000);
  }

  // Method to open the link and change button to "Claim"
  openLinkAndEnableClaimButton(index: number) {
    const card = this.cardData[index];
    
    // Mark as started, so the claim button will appear
    card.isStarted = true;

    // Open the link in a new tab
    window.open(card.link, "_blank");

    // Enable the "Claim" button after some time (simulating that user has seen the page)
    setTimeout(() => {
      card.isClaimed = false;  // Show the "Claim" button
      card.button = "Claim";    // Update button text
    }, 2000);  // Give a short delay before enabling the button
  }

  // Method to claim the reward by calling an API
  claimReward(index: number) {
    const card = this.cardData[index];

    // Disable the claim button immediately after click
    card.isClaimed = true;

    // Call API to claim the reward
    this.http.post(card.apiEndpoint, { /* payload, if needed */ }).subscribe(
      (response) => {
        // API call was successful
        console.log("Reward claimed successfully:", response);
        card.button = "Claimed";  // Optionally change the button text to "Claimed"
      },
      (error) => {
        console.error("Error claiming reward:", error);
        // Handle the error (you can re-enable the button or show a message)
        card.isClaimed = false;  // Re-enable the button if needed
      }
    );
  }
  // Open dialog box for reward
  openRewardDialog() {
    // const dialogRef = this.dialog.open(RewardDialogComponent, {
    //   width: '400px',
    //   height: 'auto',
    //   panelClass: 'reward-dialog-container', // Custom class for dialog
    //   data: {
    //     currentDay: this.currentDay,
    //     rewardAmount: this.rewards[this.currentDay - 1].amount, // Get reward for the current day
    //   },
    // });
    const dialogRef = this.dialog.open(RewardDialogComponent, {
      width: '90%',  // Make it responsive to screen size
      maxWidth: '400px',  // Ensure the dialog width doesn't exceed 400px
      height: 'auto',
      panelClass: 'reward-dialog-container',
      position: {
        top: '50%',
        left: '50%',
      },
      data: {
        currentDay: this.currentDay,
        rewardAmount: this.rewards[this.currentDay - 1].amount,
      },
    });
    
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'claimed') {
        this.isDayAvailable = false;
        this.currentDay = (this.currentDay % 7) + 1; // Loop through days 1-7
        this.checkAvailability();
      }
    });
  }
  
  
}
