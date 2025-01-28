import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-wallet-main-page',
  templateUrl: './wallet-main-page.component.html',
  styleUrls: ['./wallet-main-page.component.css'],
})
export class WalletMainPageComponent {
  successScreenVisible = false; // Toggle between wallet creation and success screen
  uniqueWord: string[] = [];
  private apiUrl = 'https://random-word-api.herokuapp.com/word?number=12'; // Random word API
  constructor(private http: HttpClient) { }
  createWallet(): void {
    this.successScreenVisible = true; // Show success screen

    // Start confetti animation
    this.startConfetti();
  }

  letsGo(): void {
    console.log('Navigating to the next step!');
    // Add navigation logic here
    this.http.get<any>(this.apiUrl).subscribe(word => {
      this.uniqueWord = word;
      console.log('Unique word for user:', this.uniqueWord);
    });
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
