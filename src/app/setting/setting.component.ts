import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  constructor(private dialog: MatDialog) {}

  openPopup(title: string): void {
    this.dialog.open(PopupDialogComponent, {
      data: { title },
      width: '300px',
    });
  }
}
@Component({
  selector: 'app-popup-dialog',
  template: `
    <div class="dialog-container">
      <h1 mat-dialog-title class="dialog-title">{{ data.title }}</h1>
      <div mat-dialog-content class="dialog-content">
        <p>Details for {{ data.title }}</p>
      </div>
      <div mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button color="warn" mat-dialog-close>
          Close
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        text-align: center;
      }
      .dialog-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .dialog-content {
        font-size: 1rem;
        margin-bottom: 20px;
      }
      .dialog-actions button {
        font-size: 1rem;
      }
    `,
  ],
})
export class PopupDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

