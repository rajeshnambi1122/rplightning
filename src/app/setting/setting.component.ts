import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ViewMnemonicDialogBoxComponent } from './view-mnemonic-dialog-box/view-mnemonic-dialog-box.component';
import { Router } from '@angular/router';
import { HonorScoreDialogBoxComponent } from './honor-score-dialog-box/honor-score-dialog-box.component';
import { SendDialogComponent } from './send-dialog/send-dialog.component';
import { EmailVerificationDialogBoxComponent } from './email-verification-dialog-box/email-verification-dialog-box.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent {
  constructor(private dialog: MatDialog,private router: Router) {}
  openSendDialog() {
    const dialogRef = this.dialog.open(SendDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Send Form Submitted:', result);
      }
    });
  }

  openDialog(item: string): void {
    const dialogRef = this.dialog.open(ViewMnemonicDialogBoxComponent ,{
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });
  }
 // New method for Honor Score
 openHonorScoreDialog(): void {
  const dialogRef = this.dialog.open(HonorScoreDialogBoxComponent, {
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Honor Score Dialog closed:', result);
  });
}

openEmailVerificationDialog(): void {
  const dialogRef = this.dialog.open(EmailVerificationDialogBoxComponent, {
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Email Verification Dialog closed:', result);
  });
}
  Community(){
    window.open('https://t.me/lightingapp', '_blank');
  }

  About(){
    this.router.navigate(["about"]);
  }
}
