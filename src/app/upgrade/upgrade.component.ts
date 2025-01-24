import { Component, OnInit } from '@angular/core';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css'],
})
export class UpgradeComponent implements OnInit {
  walletAddress: string | null = null;

  ngOnInit() {
    this.walletAddress = window.walletState.address;
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

        alert(
          'Premium upgrade successful! You can now earn up to 24 tokens per day.'
        );
      }
    } catch (error) {
      console.error('Premium upgrade failed:', error);
      alert('Premium upgrade failed. Please try again.');
    }
  }
}
