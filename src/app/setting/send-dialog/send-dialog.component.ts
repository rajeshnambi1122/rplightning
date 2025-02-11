import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.css']
})
export class SendDialogComponent {
  sendForm: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.sendForm = this.fb.group({
      walletAddress: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      network: ['', Validators.required],
      comment: ['']
    });
  }

  openSendDialog() {
    const dialogRef = this.dialog.open(SendDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Send Form Submitted:', result);
      }
    });
  }

  async onSubmit() {
    if (this.sendForm.valid) {
      console.log('Form Data:', this.sendForm.value);
      try {
            const amount = toNano(this.sendForm.value.amount);
            console.log('amount:',amount);
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
      
          } catch (error) {
            console.error('Premium upgrade failed:', error);
            alert('Premium upgrade failed. Please try again.');
          }
      // Add your submit logic here
    }
  }
}
