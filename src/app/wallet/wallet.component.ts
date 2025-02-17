import { Component, OnInit, AfterViewInit } from '@angular/core';
import { toNano, Address } from 'ton-core';
import { MatDialog } from '@angular/material/dialog';
import { SendDialogComponent } from '../setting/send-dialog/send-dialog.component';
import { TonClient } from '@ton/ton';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Initialize TON Client for mainnet
const client = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC'
});

interface WalletInfo {
  balance: number;
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, AfterViewInit {
  walletAddress: string | null = null;
  balance: number = 0;
  isPremiumUser: boolean = false;
  premiumExpiry: number | null = null;
  tonBalance: number = 0;
  Chat_ID: any;
  apiUrl = environment.apiurl;
  constructor(private dialog: MatDialog, private http: HttpClient) {}

  async ngOnInit() {
    this.Chat_ID = localStorage.getItem('Identification');
    const savedWalletState = localStorage.getItem('walletState');
    if (savedWalletState) {
      window.walletState = JSON.parse(savedWalletState);
    }

    // Set up balance checking interval
    this.checkWalletState();
    setInterval(() => this.checkWalletState(), 10000);
  }

  private async checkWalletState() {
    if (window.tonConnectUI?.connected) {
      try {
        const walletInfo = await window.tonConnectUI.wallet;
        if (walletInfo?.account?.address) {
          this.walletAddress = walletInfo.account.address;
          await this.fetchBalance(this.walletAddress);

          // Update wallet state
          window.walletState = {
            ...window.walletState,
            address: this.walletAddress,
            tokenBalance: this.tonBalance * 1e9
          };

          localStorage.setItem(
            'walletState',
            JSON.stringify(window.walletState)
          );
          this.StoreAddress();
        }
      } catch (error) {
        console.error('Error checking wallet state:', error);
      }
    }
  }

  private async fetchBalance(address: string) {
    try {
      const balance = await client.getBalance(Address.parse(address));
      this.tonBalance = Number(balance) / 1e9;
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  ngAfterViewInit() {
    if (window.tonConnectUI && !window.tonConnectUI.connected) {
      window.tonConnectUI.uiOptions = {
        ...window.tonConnectUI.uiOptions,
        buttonRootId: 'ton-connect-button'
      };
    }
  }

  formatAddress(address: string): string {
    if (!address) return '';

    try {
      if (address.startsWith('0:')) {
        const rawAddress = address.substring(2); // Remove '0:' prefix
        const friendlyAddress = Address.parseRaw('0:' + rawAddress).toString({
          urlSafe: true,
          bounceable: true
        });
        return 'UQ' + friendlyAddress.substring(2); // Add 'UQ' prefix and remove 'EQ'
      }
      console.log('address --->', address);
      return address;
    } catch (error) {
      console.error('Error formatting address:', error);
      return address;
    }
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
            amount: amount.toString()
          }
        ]
      };

      const result = await window.tonConnectUI.sendTransaction(transaction);

      if (result) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        window.walletState.isPremium = true;
        window.walletState.premiumExpiry =
          new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

        localStorage.setItem(
          'premiumStatus',
          JSON.stringify({
            isPremium: true,
            expiry: window.walletState.premiumExpiry
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
      const formattedAddress = this.formatAddress(this.walletAddress);
      navigator.clipboard
        .writeText(formattedAddress)
        .then(() => {
          alert('Wallet address copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy wallet address. Please try again.');
        });
    }
  }

  openSendDialog() {
    const dialogRef = this.dialog.open(SendDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Send Form Submitted:', result);
      }
    });
  }

  /**Address Store API  */
  StoreAddress() {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpOptions = { headers: headers_object };

    // Get and format the wallet address
    const rawAddress = this.walletAddress || window.walletState?.address || '';
    const formattedAddress = this.formatAddress(rawAddress);

    if (formattedAddress && this.Chat_ID) {
      this.http
        .put<any>(
          this.apiUrl +
            'webhook/update/' +
            formattedAddress +
            '/' +
            this.Chat_ID,
          {},
          httpOptions
        )
        .subscribe(
          response => {
            console.log('Wallet address stored successfully:', response);
          },
          error => {
            console.error('Error storing wallet address:', error);
          }
        );
    }
  }
}
