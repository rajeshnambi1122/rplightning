import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-mnemonic-dialog-box',
  templateUrl: './view-mnemonic-dialog-box.component.html',
  styleUrls: ['./view-mnemonic-dialog-box.component.css']
})
export class ViewMnemonicDialogBoxComponent {
  // mnemonicWords = ['melt', 'bulk', 'humble', 'need', 'cruel', 'click', 'smile', 'plug', 'front', 'glass', 'neither', 'wide'];
  mnemonicWords: string[] = []
  showMnemonic = false;
  Chat_ID: any;
  apiUrl1 = environment.apiurl;
  constructor(public matdialog: MatDialogRef<ViewMnemonicDialogBoxComponent>,private http: HttpClient, private router: ActivatedRoute) {
    matdialog.disableClose = true;
  }
  toggleMnemonicVisibility() {
    this.showMnemonic = !this.showMnemonic;
  }
  ngOnInit(): void {
    this.Chat_ID = localStorage.getItem('Identification');
    this.getUserDetails();
  }
  closeDialog() {
    // Logic to close the dialog (depends on how the dialog is implemented)
    this.matdialog.close();
  }
    private getHeaders() {
      const headers = new HttpHeaders({
        'ngrok-skip-browser-warning':  '69420'
      });
      return {headers};
    }
    getUserDetails(){
      const url = `${this.apiUrl1}webhook/getUserDetail/${this.Chat_ID}`;
  
  
      this.http.get<any>(url, this.getHeaders()).subscribe((result) => {
        if (result) {
          // this.ReferealData = result.refferalId;
          this.mnemonicWords = result.walletwords.phrases.split(',');
          // this.getReferedUserDetails(this.ReferealData);
          console.log("Refferal ID:",result);
        } else {
          console.error("Refferal ID not found in response", result);
        }
      });
    }
}
