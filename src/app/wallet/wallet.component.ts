import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit, AfterViewInit {
  walletAddress: string | null = null;
  balance: number = 0;

  ngOnInit() {
    // Set initial state
    this.walletAddress = window.walletState.address;

    // Set up interval to check wallet state
    setInterval(() => {
      if (this.walletAddress !== window.walletState.address) {
        this.walletAddress = window.walletState.address;
        if (this.walletAddress) {
          this.fetchBalance();
        } else {
          this.balance = 0;
        }
      }
    }, 1000);
  }

  ngAfterViewInit() {
    // Set the button root ID after the view is initialized
    if (window.tonConnectUI) {
      window.tonConnectUI.uiOptions = {
        ...window.tonConnectUI.uiOptions,
        buttonRootId: 'ton-connect-button',
      };
    }
  }

  formatAddress(address: string): string {
    if (address.length > 20) {
      return `${address.substring(0, 10)}...${address.substring(
        address.length - 10
      )}`;
    }
    return address;
  }

  private async fetchBalance() {
    // Implement balance fetching logic here
    this.balance = 0;
  }
}
