import { Component, OnInit } from '@angular/core';
import { TonConnectUI } from '@tonconnect/ui';

declare global {
  interface Window {
    tonConnectUI: TonConnectUI;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rplightning';

  ngOnInit() {
    // Initialize TonConnect
    window.tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://rajeshnambi1122.github.io/rplightning/assets/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button'
    });
  }
}
