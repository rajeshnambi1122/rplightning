import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.css'],
})
export class SendDialogComponent {
  sendForm: FormGroup;

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.sendForm = this.fb.group({
      walletAddress: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      network: ['', Validators.required],
      comment: [''],
    });
  }

  openSendDialog() {
    const dialogRef = this.dialog.open(SendDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Send Form Submitted:', result);
      }
    });
  }

  async onSubmit() {
    if (this.sendForm.valid) {
      try {
        const amount = toNano(this.sendForm.value.amount);
        const receiverAddress = this.sendForm.value.walletAddress;

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              address: receiverAddress,
              amount: amount.toString(),
              comment: this.sendForm.value.comment || '',
            },
          ],
        };

        const result = await window.tonConnectUI.sendTransaction(transaction);
        if (result) {
          this.dialog.closeAll();
        }
      } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed. Please try again.');
      }
    }
  }
}
