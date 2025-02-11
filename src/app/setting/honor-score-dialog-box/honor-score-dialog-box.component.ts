import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as THREE from 'three';

@Component({
  selector: 'app-honor-score-dialog-box',
  templateUrl: './honor-score-dialog-box.component.html',
  styleUrls: ['./honor-score-dialog-box.component.css']
})
export class HonorScoreDialogBoxComponent {
  // backgroundImage = require('./ancient-1297304_640.webp');
  shieldPercentage: number = 0;  // Default value is 0%
apiUrl1 = environment.apiurl;
Chat_ID: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.Chat_ID = localStorage.getItem('Identification');
    console.log("this.Chat_ID --->", this.Chat_ID)
    this.fetchShieldPercentage();
  }
   private getHeaders() {
      const headers = new HttpHeaders({
        'ngrok-skip-browser-warning': '69420'
      });
      return { headers };
    }

  fetchShieldPercentage() {
    const url = `${this.apiUrl1}webhook/getUserDetail/${this.Chat_ID}`;
    // Example API call - replace with your actual API endpoint
    this.http.get<any>(url, this.getHeaders())
      .subscribe(
        (response) => {
          console.log("RESPONCE --->",response)
          this.shieldPercentage = response.cibilScore;
        },
        error => {
          console.error('Failed to fetch percentage', error);
        }
      );
  }
}
