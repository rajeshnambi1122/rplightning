import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ViewMnemonicDialogBoxComponent } from './view-mnemonic-dialog-box/view-mnemonic-dialog-box.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent {
  constructor(private dialog: MatDialog,private router: Router) {}

  openDialog(item: string): void {
    const dialogRef = this.dialog.open(ViewMnemonicDialogBoxComponent ,{
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });
  }

  Community(){
    window.open('https://t.me/lightingapp', '_blank');
  }

  About(){
    this.router.navigate(["about"]);
  }
}
