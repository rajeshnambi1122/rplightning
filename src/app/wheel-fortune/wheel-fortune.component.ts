import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-wheel-fortune',
  templateUrl: './wheel-fortune.component.html',
  styleUrls: ['./wheel-fortune.component.css'],
  animations: [
    trigger('hexagonAnimation', [
      state(
        'active',
        style({
          background: 'linear-gradient(145deg, #ff4081, #e91e63)',
          transform: 'scale(1.1)',
        })
      ),
      state(
        'spinning',
        style({
          background: 'linear-gradient(145deg, #ff4081, #e91e63)',
          transform: 'scale(1.05)',
        })
      ),
      state(
        'inactive',
        style({
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          transform: 'scale(1)',
        })
      ),
      transition('* => active', animate('200ms ease-in')),
      transition('* => spinning', animate('100ms ease-in')),
      transition('* => inactive', animate('200ms ease-out')),
    ]),
  ],
})
export class WheelFortuneComponent {
  hexagons = [
    { id: 0, value: 0.5, label: "Light's", state: 'inactive' },
    { id: 1, value: 1.05, label: "$", state: 'inactive' },
    { id: 2, value: 2, label: "Light's", state: 'inactive' },
    { id: 3, value: 10, label: "$", state: 'inactive' },
    { id: 4, value: 5, label: "Light's", state: 'inactive' },
    { id: 5, value: 20, label: "$", state: 'inactive' },
  
    { id: 6, value: 0.5, label: "$", state: 'inactive' },
    { id: 7, value: 10, label: "Light's", state: 'inactive' },
  
  
   
   
    { id: 8, value: 2, label: "$", state: 'inactive' },
  
    { id: 9, value: 5, label: "$", state: 'inactive' } // Only 1 in the last row
  ];
   apiUrl = environment.apiurl;
    Chat_ID: any;
    wheelFortune: any;
  spinning = false;
  selectedHexagon: number | null = null;
  claimAvailable = false;
  gameOver = false;
  lastSpinTimestamp: number | null = null;
  remainingTime: string = '';

  constructor(public dialogRef: MatDialogRef<WheelFortuneComponent>, private http: HttpClient) {}

  ngOnInit() {
    this.Chat_ID = localStorage.getItem('Identification');
    this.getUserDetails();
    this.checkCooldown();
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
        console.log("Refferal ID:resultresultresult",result.dailyRewardsSpinLastClaimTime);
        this.wheelFortune = result.dailyRewardsSpinLastClaimTime
        this.checkCooldown();
        console.log("Refferal ID:this.wheelFortune",this.wheelFortune);
      } else {
        console.error("Refferal ID not found in response", result);
      }
    });
  }
  checkCooldown() {
    console.log("DATA this.wheelFortune211 -->",this.wheelFortune)
    const storedTimestamp = this.wheelFortune;
    if (storedTimestamp) {
      console.log("DATA this.wheelFortune -->",this.wheelFortune)
      this.remainingTime = this.wheelFortune
      // this.spinning = true;
      this.gameOver = true
      // this.lastSpinTimestamp = parseInt(storedTimestamp, 10);
      // const now = Date.now();
      // const diff = this.lastSpinTimestamp + 24 * 60 * 60 * 1000 - now;
      
      // if (diff > 0) {
      //   this.gameOver = true; // Disable spin
      //   this.updateRemainingTime(diff);
      //   setInterval(() => this.updateRemainingTime(diff), 1000);
      // } else {
      //   this.gameOver = false;
      // }
    }
  }

  // updateRemainingTime(diff: number) {
  //   const hours = Math.floor(diff / (1000 * 60 * 60));
  //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  //   this.remainingTime = `${hours}h ${minutes}m ${seconds}s`;
  // }

  spinWheel() {
    if (!this.spinning) {
      this.spinning = true;
      this.claimAvailable = false;

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex > 0) {
          this.hexagons[(currentIndex - 1) % this.hexagons.length].state = 'inactive';
        } else {
          this.hexagons[this.hexagons.length - 1].state = 'inactive';
        }

        this.hexagons[currentIndex].state = 'spinning';
        currentIndex = (currentIndex + 1) % this.hexagons.length;
      }, 100);

      setTimeout(() => {
        clearInterval(interval);

        // Stop on a "Light's" value
        const lightsOptions = this.hexagons.filter(h => h.label === "Light's");
        const winningHexagon = lightsOptions[Math.floor(Math.random() * lightsOptions.length)];

        this.hexagons.forEach((hex) => (hex.state = 'inactive'));
        winningHexagon.state = 'active';
        this.selectedHexagon = winningHexagon.id;

        // Enable claim button and set cooldown
        this.claimAvailable = true;
        this.gameOver = true;
        // this.spinning = false;
        // this.lastSpinTimestamp = Date.now();
        // localStorage.setItem('lastSpinTime', this.lastSpinTimestamp.toString());
        this.checkCooldown();
      }, 3000);
    }
  }

  claimReward() {
    if (this.claimAvailable) {
      // alert(`You claimed: ${this.hexagons[this.selectedHexagon!].value} Light's`);
      // this.claimAvailable = false;
      // this.gameOver = true; // Prevent spinning again
      
          var headers_object = new HttpHeaders({
            'Content-Type': 'application/json'
          });
          const httpOptions = { headers: headers_object };
          this.http.put<any>(this.apiUrl + "webhook/balanceUpdate/" + this.Chat_ID + "/" + this.hexagons[this.selectedHexagon!].value, {}, httpOptions).subscribe(
            (response) => {
              
              this.http.put<any>(this.apiUrl + "webhook/lastDateUpdate/" + this.Chat_ID + "/" + new Date().toISOString()+'/2', {}, httpOptions).subscribe(
                (response) => {
                  this.claimAvailable = false;
                  this.spinning = true;
                  this.gameOver = true; // Prevent spinning again
                 this.getUserDetails()
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
  
  close() {
    this.dialogRef.close(
      this.selectedHexagon !== null
        ? this.hexagons[this.selectedHexagon].value
        : null
    );
  }
}
