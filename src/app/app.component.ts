import { Component, OnInit } from '@angular/core';
import { TonConnectUI } from '@tonconnect/ui';

declare global {
  interface Window {
    tonConnectUI: TonConnectUI;
    walletState: {
      address: string | null;
      isPremium: boolean;
      premiumExpiry: number | null;
    };
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rplightning';

  ngOnInit() {
    // Initialize wallet state
    window.walletState = {
      address: null,
      isPremium: false,
      premiumExpiry: null,
    };

    // Initialize TonConnect
    window.tonConnectUI = new TonConnectUI({
      manifestUrl:
        'https://rajeshnambi1122.github.io/rplightning/assets/tonconnect-manifest.json',
    });

    // Set up global wallet listener
    window.tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        window.walletState.address = wallet.account.address;
        this.checkPremiumStatus();
      } else {
        window.walletState.address = null;
        window.walletState.isPremium = false;
        window.walletState.premiumExpiry = null;
      }
    });
  }

  private checkPremiumStatus(): void {
    const premiumStatus = localStorage.getItem('premiumStatus');
    if (premiumStatus) {
      const status = JSON.parse(premiumStatus);
      if (status.expiry > new Date().getTime()) {
        window.walletState.isPremium = true;
        window.walletState.premiumExpiry = status.expiry;
      } else {
        localStorage.removeItem('premiumStatus');
        window.walletState.isPremium = false;
        window.walletState.premiumExpiry = null;
      }
    }
  }
}
