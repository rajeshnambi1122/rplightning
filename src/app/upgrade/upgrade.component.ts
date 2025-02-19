import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css'],
})
export class UpgradeComponent implements OnInit {
  walletAddress: string | null = null;
  isUpgraded: boolean = false;
  upgradedMode: string | null = null;
  apiUrl = environment.apiurl;
  Chat_ID: any;
  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.walletAddress = window.walletState.address;
    this.Chat_ID = localStorage.getItem('Identification');
    this.getUserDetails();
    // Check if user has already upgraded

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
        console.log("Refferal ID:resultresultresult", result);
        const premiumStatus = result.premiumStatus;
        if (premiumStatus) {
          // const status = JSON.parse(premiumStatus);
          this.isUpgraded = premiumStatus.isPremium;
          this.upgradedMode = premiumStatus.mode;
        }

      } else {
        console.error("Refferal ID not found in response", result);
      }
    });
  }
  async upgradeToHyper(): Promise<void> {
    if (!this.walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (this.isUpgraded) {
      alert('You have already upgraded to ' + this.upgradedMode);
      return;
    }

    try {
      const amount = toNano('0.5');
      const receiverAddress =
        'EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI';

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: receiverAddress,
            amount: amount.toString(),
          },
        ],
      };

      const result = await window.tonConnectUI.sendTransaction(transaction);

      if (result) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        var headers_object = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        const httpOptions = { headers: headers_object };
        let param = { mode: "hyper" }
        this.http.put<any>(this.apiUrl + "webhook/upgrade/" + this.Chat_ID + "/" + param.mode, {}, httpOptions).subscribe(
          (response) => {
            this.getUserDetails()

          },
          (error) => {
            console.error('Error claiming reward:', error);
            // Optionally show error message in the UI
          }
        );

        alert('Hyper Mode upgrade successful! You can now earn up to 24 tokens per day.');
      }
    } catch (error) {
      console.error('Premium upgrade failed:', error);
      alert('Premium upgrade failed. Please try again.');
    }
  }

  async upgradeToDynamic(): Promise<void> {
    if (!this.walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (this.isUpgraded) {
      alert('You have already upgraded to ' + this.upgradedMode);
      return;
    }
    else {
      var headers_object = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      const httpOptions = { headers: headers_object };
      let param = { isPremium: true,mode: "dynamic" }
      this.http.put<any>(this.apiUrl + "webhook/upgrade/" + this.Chat_ID, param, httpOptions).subscribe(
        (response) => {
          this.getUserDetails();
        },
        (error) => {
          console.error('Error claiming reward:', error);
        }
      );

      alert('Dynamic Mode upgrade successful! You can now earn up to 24 tokens per day.');
    }
  }
  // try {
  // const amount = toNano('2');
  // const receiverAddress =
  //   'EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI';

  // const transaction = {
  //   validUntil: Math.floor(Date.now() / 1000) + 600,
  //   messages: [
  //     {
  //       address: receiverAddress,
  //       amount: amount.toString(),
  //     },
  //   ],
  // };

  // const result = await window.tonConnectUI.sendTransaction(transaction);

  // if (result) {
  //   await new Promise((resolve) => setTimeout(resolve, 3000));
  //   var headers_object = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   const httpOptions = { headers: headers_object };
  //   let param = { mode: "dynamic" }
  //   this.http.put<any>(this.apiUrl + "webhook/upgrade/" + this.Chat_ID + "/" + param.mode, {}, httpOptions).subscribe(
  //     (response) => {
  //       this.getUserDetails()

  //     },
  //     (error) => {
  //       console.error('Error claiming reward:', error);
  //     }
  //   );

  //   alert('Dynamic Mode upgrade successful! You can now earn up to 24 tokens per day.');
  // }
  // } 
  // catch (error) {
  //     console.error('Premium upgrade failed:', error);
  //     alert('Premium upgrade failed. Please try again.');
  //   }
  // }
}
