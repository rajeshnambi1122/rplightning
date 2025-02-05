import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { environment } from 'src/environments/environment';
import * as bip39 from 'bip39';
@Component({
  selector: 'app-wallet-main-page',
  templateUrl: './wallet-main-page.component.html',
  styleUrls: ['./wallet-main-page.component.css'],
})
export class WalletMainPageComponent {
  successScreenVisible = false; // Toggle between wallet creation and success screen
  uniqueWord: string[] = [];
  Chat_ID: any;
  isLoading = false;
  apiUrl1 = environment.apiurl;
  // private apiUrl = 'https://random-word-api.herokuapp.com/word?number=12'; // Random word API
  constructor(private http: HttpClient, private router: ActivatedRoute, private router1: Router) { }
  ngOnInit(): void {
    this.Chat_ID = this.router.snapshot.paramMap.get("id");
    this.getRandomWords();
    console.log("this.Chat_ID --->", this.Chat_ID)
  }
  getRandomWords() {
    this.uniqueWord = this.generateMnemonic();
    console.log("this.mnemonicWords --->", this.uniqueWord)
    var headers_object = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    });
    const httpOptions = { headers: headers_object };
    const result = this.uniqueWord.join(',');
    this.http.post(this.apiUrl1 + `wallet-words/` + this.Chat_ID + "/" + 
      result, {}, httpOptions)
      .subscribe((result: any) => {
        this.router1.navigate(['mine', this.Chat_ID]);

      });
}
generateMnemonic(): string[] {
  const mnemonic = bip39.generateMnemonic(128); // 128-bit entropy = 12 words
  return mnemonic.split(' '); // Convert string to array of words
}
createWallet(): void {
  this.successScreenVisible = true; // Show success screen

  // Start confetti animation
  this.startConfetti();
}

// letsGo(): void {
//   console.log('Navigating to the next step!');
//   this.http.get<any>(this.apiUrl).subscribe(word => {
//     this.uniqueWord = word;
//     console.log('Unique word for user:', this.uniqueWord);
//     var headers_object = new HttpHeaders({
//       'Access-Control-Allow-Origin': '*',
//     });
//     const httpOptions = { headers: headers_object };
//     const result = this.uniqueWord.join(',');
//     this.http.post(this.apiUrl1 + `wallet-words/` + this.Chat_ID + "/" + result, {}, httpOptions)
//       .subscribe((result: any) => {
//         this.router1.navigate(['mine', this.Chat_ID]);

//       });
//   });
// }
letsGo(): void {
  console.log('Navigating to the next step!');
  this.isLoading = true; // Start loading

  // this.http.get<any>(this.apiUrl).subscribe(word => {
  //   this.uniqueWord = word;
  //   console.log('Unique word for user:', this.uniqueWord);

  //   var headers_object = new HttpHeaders({
  //     'Access-Control-Allow-Origin': '*',
  //   });

  //   const httpOptions = { headers: headers_object };
  //   const result = this.uniqueWord.join(',');

  //   this.http.post(this.apiUrl1 + `webhook/wallet-words/` + this.Chat_ID + "/" + result, {}, httpOptions)
  //     .subscribe((result: any) => {
  //       this.isLoading = false; // Stop loading
  //       this.router1.navigate(['mine', this.Chat_ID]);  // Redirect after response
  //     }, error => {
  //       console.error("Error in API:", error);
  //       this.isLoading = false; // Stop loading even if there's an error
  //     });
  // });
}

  private startConfetti(): void {
  const duration = 5 * 1000; // 5 seconds
  const end = Date.now() + duration;

  const colors = ['#FFC700', '#FF0000', '#2EBDFF', '#28A745', '#FF69B4'];

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: Math.random() * 360,
      spread: 55,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2, // Slightly above screen height
      },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
}
