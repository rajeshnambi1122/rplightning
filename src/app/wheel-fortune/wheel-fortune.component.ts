import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-wheel-fortune',
  templateUrl: './wheel-fortune.component.html',
  styleUrls: ['./wheel-fortune.component.css'],
  animations: [
    trigger('spinWheel', [
      state(
        'spinning',
        style({
          transform:
            'rotate({{degrees}}deg) perspective(1000px) rotateX(25deg)',
        }),
        { params: { degrees: 0 } }
      ),
      state(
        'idle',
        style({
          transform: 'rotate(0deg) perspective(1000px) rotateX(25deg)',
        })
      ),
      transition(
        '* => spinning',
        animate('5s cubic-bezier(0.17, 0.67, 0.12, 0.99)')
      ),
    ]),
  ],
})
export class WheelFortuneComponent {
  spinning = false;
  selectedReward: number | null = null;
  rewards = [100, 200, 300, 400, 500, 1000, 2000, 3000];
  rotationDegrees = 0;
  spinState = 'idle';

  constructor(
    public dialogRef: MatDialogRef<WheelFortuneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Remove dialog padding
    this.dialogRef.addPanelClass('no-padding-dialog');
  }

  spinWheel() {
    if (!this.spinning) {
      this.spinning = true;
      const randomSpins = 5 + Math.floor(Math.random() * 5);
      const randomDegree = Math.floor(Math.random() * 360);
      this.rotationDegrees = randomSpins * 360 + randomDegree;
      this.spinState = 'spinning';

      setTimeout(() => {
        this.spinning = false;
        const selectedIndex = Math.floor(
          (360 - (this.rotationDegrees % 360)) / (360 / this.rewards.length)
        );
        this.selectedReward = this.rewards[selectedIndex];
        this.spinState = 'idle'; // Reset state after spinning
      }, 5000);
    }
  }

  close() {
    this.dialogRef.close(this.selectedReward);
  }
}
