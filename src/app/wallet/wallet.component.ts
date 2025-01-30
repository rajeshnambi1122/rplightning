import { Component, OnInit, AfterViewInit } from '@angular/core';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit, AfterViewInit {
  walletAddress: string | null = null;
  balance: number = 0;
  isPremiumUser: boolean = false;
  premiumExpiry: number | null = null;

  ngOnInit() {
    // Set initial state
    this.walletAddress = window.walletState.address;
    this.isPremiumUser = window.walletState.isPremium;
    this.premiumExpiry = window.walletState.premiumExpiry;

    // Set up interval to check wallet state
    setInterval(() => {
      if (this.walletAddress !== window.walletState.address) {
        this.walletAddress = window.walletState.address;
        this.isPremiumUser = window.walletState.isPremium;
        this.premiumExpiry = window.walletState.premiumExpiry;
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

  async upgradeToPremium(): Promise<void> {
    if (!this.walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const amount = toNano('0.5');
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

      if (result) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        window.walletState.isPremium = true;
        window.walletState.premiumExpiry =
          new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

        localStorage.setItem(
          'premiumStatus',
          JSON.stringify({
            isPremium: true,
            expiry: window.walletState.premiumExpiry,
          })
        );

        this.isPremiumUser = true;
        this.premiumExpiry = window.walletState.premiumExpiry;

        alert(
          'Premium upgrade successful! You can now earn up to 24 tokens per day.'
        );
      }
    } catch (error) {
      console.error('Premium upgrade failed:', error);
      alert('Premium upgrade failed. Please try again.');
    }
  }

  copyWalletAddress(): void {
    if (this.walletAddress) {
      navigator.clipboard
        .writeText(this.walletAddress)
        .then(() => {
          alert('Wallet address copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy wallet address. Please try again.');
        });
    }
  }
}
