import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  hexagons = Array(12)
    .fill(0)
    .map((_, i) => ({
      id: i,
      state: 'inactive',
      value: (i + 1) * 100,
    }));
  spinning = false;
  selectedHexagon: number | null = null;

  constructor(public dialogRef: MatDialogRef<WheelFortuneComponent>) {}

  spinWheel() {
    if (!this.spinning) {
      this.spinning = true;
      let currentIndex = 0;

      const interval = setInterval(() => {
        // Reset previous hexagon
        if (currentIndex > 0) {
          this.hexagons[(currentIndex - 1) % this.hexagons.length].state =
            'inactive';
        } else {
          this.hexagons[this.hexagons.length - 1].state = 'inactive';
        }

        // Set current hexagon to spinning state
        this.hexagons[currentIndex].state = 'spinning';
        currentIndex = (currentIndex + 1) % this.hexagons.length;
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        const winningIndex = Math.floor(Math.random() * this.hexagons.length);

        // Reset all hexagons
        this.hexagons.forEach((hex) => (hex.state = 'inactive'));

        // Set winning hexagon to active
        this.hexagons[winningIndex].state = 'active';
        this.selectedHexagon = winningIndex;
        console.log("this.selectedHexagon -->",this.selectedHexagon)
        this.spinning = false;
      }, 3000);
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
