import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TonConnect } from '@tonconnect/sdk';
import { TonConnectUI, SendTransactionRequest } from '@tonconnect/ui';
import { Address, toNano } from 'ton-core';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css'],
})
export class MineComponent {
  // Add premium user properties
  isPremiumUser = false;
  readonly PREMIUM_MAX_TOKENS = 24; // Premium users can earn 24 tokens per day
  readonly REGULAR_MAX_TOKENS = 12; // Regular users stay at 12 tokens per day

  // Update profile to include premium status
  profile = {
    balance: 0,
    power: 12200,
    premiumExpiry: null as number | null,
  };

  bandwidth = {
    status: 'Inactive',
    shares: 0,
    earned: 0,
    statusColor: 'red', // Add this line to define the statusColor property
  };
  isMining = false;
  isClaiming = false;
  buttonLabel = 'Start Mining';
  miningStartTime: number | null = null;
  elapsedHours = 0;
  accumulatedShares = 0;
  speedCheckTimer: any;
  results: any[] = []; // For storing network speed results
  claimTimer: any; // For managing the 3-hour cooldown after claiming
  miningCooldown = false; // To handle 3-hour cooldown
  powerStatusColor = 'red'; // Default to red for low power
  powerDots = ['dot', 'dot', 'dot', 'dot', 'dot', 'dot']; // Default 6 dots (all grey)

  deviceType: string = 'Unknown';
  ip: string = 'Fetching...';

  // Add TON Connect properties
  private tonConnect!: TonConnectUI;
  walletAddress: string | null = null;

  constructor(private http: HttpClient) {
    // Wait for DOM to be ready before initializing TonConnect
    setTimeout(() => {
      this.tonConnect = new TonConnectUI({
        manifestUrl:
          'https://rajeshnambi1122.github.io/rplightning/assets/tonconnect-manifest.json',
        buttonRootId: 'ton-connect-button',
      });

      // Listen for wallet connection changes
      this.tonConnect.onStatusChange((wallet) => {
        if (wallet) {
          this.walletAddress = wallet.account.address;
        } else {
          this.walletAddress = null;
        }
      });
    }, 0);
  }

  ngOnInit(): void {
    // Add premium status check to existing initialization
    const premiumStatus = localStorage.getItem('premiumStatus');
    if (premiumStatus) {
      const status = JSON.parse(premiumStatus);
      if (status.expiry > new Date().getTime()) {
        this.isPremiumUser = true;
        this.profile.premiumExpiry = status.expiry;
      } else {
        // Premium expired
        localStorage.removeItem('premiumStatus');
      }
    }

    // Restore mining progress from localStorage
    const savedProgress = localStorage.getItem('miningProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.bandwidth.shares = progress.shares;
      this.bandwidth.earned = progress.earned;
      this.accumulatedShares = progress.accumulatedShares;
    }

    this.fetchDeviceInformation();
    this.calculateElapsedTime();
    setInterval(() => this.calculateElapsedTime(), 1000 * 60);

    // Check saved mining state
    const savedMiningState = localStorage.getItem('miningState');
    if (savedMiningState) {
      const state = JSON.parse(savedMiningState);
      if (state.isMining) {
        // Check if we're within the 6-hour mining window
        const now = new Date().getTime();
        const elapsedHours = Math.floor(
          (now - state.miningStartTime) / (1000 * 60 * 60)
        );

        if (elapsedHours < 6) {
          // Only restore mining state if within 6-hour window
          this.isMining = true;
          this.bandwidth.status = 'Active';
          this.bandwidth.statusColor = 'green';
          this.buttonLabel = 'Stop Mining';
          this.miningStartTime = state.miningStartTime;
          this.startSpeedCheck();
        } else {
          // Clear mining state if beyond 6 hours
          localStorage.removeItem('miningState');
        }
      }
    }

    this.checkPremiumStatus();
  }

  fetchDeviceInformation(): void {
    this.http
      .get<{ ip: string }>('https://api.ipify.org?format=json')
      .subscribe(
        (response) => {
          this.ip = response.ip;
        },
        (error) => {
          console.error('Error fetching IP:', error);
          this.ip = 'Error';
        }
      );

    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      this.deviceType = 'Mobile';
    } else if (/tablet/i.test(userAgent)) {
      this.deviceType = 'Tablet';
    } else {
      this.deviceType = 'Desktop';
    }
  }

  calculateElapsedTime(): void {
    if (this.miningStartTime) {
      const now = new Date().getTime();
      this.elapsedHours = Math.floor(
        (now - this.miningStartTime) / (1000 * 60 * 60)
      );
      this.updatePowerDots(); // Update power dots based on elapsed hours
    }
  }

  updatePowerDots(): void {
    const dotsToUpdate = Math.min(this.elapsedHours, 6); // Only 6 dots max
    const initialPower = 12200; // Initial power value
    const reductionPerHour = 2033; // Power reduction per hour
    let reducedPower = initialPower - this.elapsedHours * reductionPerHour;

    if (reducedPower < 0) {
      reducedPower = 0; // Ensure power does not go below 0
    }

    // Update the profile power
    this.profile.power = reducedPower;

    this.powerDots = ['dot', 'dot', 'dot', 'dot', 'dot', 'dot']; // Reset to default

    for (let i = 0; i < dotsToUpdate; i++) {
      this.powerDots[i] = `dot red`; // Red color for elapsed hours
    }

    for (let i = dotsToUpdate; i < 6; i++) {
      this.powerDots[i] = `dot green`; // Green color for remaining dots
    }

    if (this.elapsedHours >= 6) {
      this.powerStatusColor = 'red'; // Show cooldown when 6 hours are completed
    }
  }
  handleMiningToggle(): void {
    if (this.isMining) {
      this.stopMining();
    } else {
      this.startMining();
    }
  }

  startMining(): void {
    if (this.miningCooldown) {
      alert('Mining is on cooldown. Please try again after 3 hours.');
      return;
    }

    this.isMining = true;
    this.bandwidth.status = 'Active';
    this.bandwidth.statusColor = 'green';
    this.buttonLabel = 'Stop Mining';
    this.miningStartTime = new Date().getTime();

    // Save mining state
    localStorage.setItem(
      'miningState',
      JSON.stringify({
        isMining: true,
        miningStartTime: this.miningStartTime,
      })
    );

    this.startSpeedCheck();
  }

  stopMining(): void {
    this.isMining = false;
    this.bandwidth.status = 'Inactive';
    this.bandwidth.statusColor = 'red';
    this.buttonLabel = 'Start Mining';
    clearTimeout(this.speedCheckTimer);
    this.updatePowerDots();

    // Clear mining state but keep progress
    localStorage.removeItem('miningState');
  }

  handleClaim(): void {
    if (this.elapsedHours >= 6) {
      this.isClaiming = true;
      const tokensToAdd = this.bandwidth.earned;
      
      // Update balance
      this.profile.balance += tokensToAdd;
      
      // Reset mining stats and clear localStorage
      setTimeout(() => {
        this.isClaiming = false;
        this.bandwidth.shares = 0;
        this.bandwidth.earned = 0;
        this.miningStartTime = null;
        this.elapsedHours = 0;
        this.accumulatedShares = 0;
        localStorage.removeItem('miningProgress'); // Clear progress after claiming
        this.stopMining();
        alert(`Successfully claimed ${tokensToAdd} tokens! Your new balance is ${this.profile.balance} tokens.`);
        this.startMiningCooldown();
      }, 2000);
    }
  }

  startMiningCooldown(): void {
    this.miningCooldown = true;
    setTimeout(() => {
      this.miningCooldown = false;
      this.powerStatusColor = 'green'; // Restore power status color after 3 hours
      this.bandwidth.status = 'Inactive';
      this.bandwidth.statusColor = 'red'; // Reset to inactive color
      this.updatePowerDots(); // Reset the power dots after cooldown
    }, 1000 * 60 * 60 * 3); // 3 hours cooldown
  }

  startSpeedCheck(): void {
    this.speedCheckTimer = setTimeout(() => {
      this.measureSpeedInParallel();
      this.startSpeedCheck(); // Recursive call to continue the timer
    }, 6000); // 6 seconds
  }

  private async measureSpeed(): Promise<any> {
    const startTime = new Date().getTime();
    const imageUrl = 'assets/download.jpeg'; // Path to your image in the assets folder

    try {
      const response = await this.http
        .get(imageUrl, { observe: 'response', responseType: 'blob' })
        .toPromise();

      // Check if response is defined
      if (!response) {
        throw new Error('Response is undefined.');
      }

      const endTime = new Date().getTime();
      const diff = (endTime - startTime) / 1000; // Time in seconds

      const contentLength = response.headers.get('content-length');
      if (!contentLength) {
        throw new Error(
          'Content length is not available in the response headers.'
        );
      }

      const bits = parseInt(contentLength, 10) * 8; // Convert bytes to bits
      const bps = (bits / diff).toFixed(2);
      const kbps = (Number(bps) / 1024).toFixed(2);
      const mbps = (Number(kbps) / 1024).toFixed(2);

      return { bps, kbps, mbps };
    } catch (error) {
      console.error('Error measuring speed:', error);
      return { bps: 0, kbps: 0, mbps: 0 };
    }
  }

  private async measureSpeedInParallel(): Promise<void> {
    const requests = [this.measureSpeed()];
    try {
      const results = await Promise.all(requests);
      this.results = results.map((res, index) => ({
        process: `Process 0${index + 1}`,
        bps: res.bps,
        kbps: res.kbps,
        mbps: res.mbps,
      }));

      // Update shares and earned based on the speed
      const totalMbps = results.reduce(
        (sum, result) => sum + Number(result.mbps),
        0
      );
      this.accumulatedShares += totalMbps;
      if (this.accumulatedShares > 60) this.accumulatedShares = 60; // Cap shares
      this.bandwidth.shares = this.accumulatedShares;
      this.bandwidth.earned = Math.floor(this.accumulatedShares / 5);

      // Apply premium/regular token caps
      const maxTokens = this.isPremiumUser
        ? this.PREMIUM_MAX_TOKENS
        : this.REGULAR_MAX_TOKENS;
      if (this.bandwidth.earned > maxTokens) {
        this.bandwidth.earned = maxTokens;
      }

      if (this.bandwidth.earned > 0) this.bandwidth.status = 'Active';

      // Save progress to localStorage
      localStorage.setItem('miningProgress', JSON.stringify({
        shares: this.bandwidth.shares,
        earned: this.bandwidth.earned,
        accumulatedShares: this.accumulatedShares
      }));
    } catch (error) {
      console.error('Error in speed check:', error);
    }
  }

  // Add method to handle premium upgrade
  async upgradeToPremium(): Promise<void> {
    if (!this.walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Premium subscription cost (0.5 TON)
      const amount = toNano('0.5');

      // Your dApp's wallet address where payments will be received
      const receiverAddress =
        'EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI'; // Replace with your wallet address

      const transaction: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes expiration
        messages: [
          {
            address: receiverAddress,
            amount: amount.toString(),
            payload: 'te6ccgEBAQEABgAACAVERkZG', // Base64 encoded empty cell
          },
        ],
      };

      // Send transaction
      const result = await this.tonConnect.sendTransaction(transaction);

      if (result) {
        // Show loading state
        this.isClaiming = true; // Reuse existing loading state

        try {
          // Wait for transaction confirmation
          await this.checkTransactionStatus(result.boc);

          // Update premium status
          this.isPremiumUser = true;
          this.profile.premiumExpiry =
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days

          // Save premium status
          localStorage.setItem(
            'premiumStatus',
            JSON.stringify({
              isPremium: true,
              expiry: this.profile.premiumExpiry,
            })
          );

          alert(
            'Premium upgrade successful! You can now earn up to 24 tokens per day.'
          );
        } catch (error) {
          console.error('Transaction verification failed:', error);
          alert(
            'Could not verify payment. Please contact support if funds were deducted.'
          );
        } finally {
          this.isClaiming = false;
        }
      }
    } catch (error) {
      console.error('Premium upgrade payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  }

  private async checkTransactionStatus(transactionHash: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;

      const checkInterval = setInterval(async () => {
        try {
          // Query your backend to verify the transaction
          const response = await this.http
            .get<{ status: string }>(
              `https://your-backend.com/api/verify-transaction/${transactionHash}`
            )
            .toPromise();

          if (response?.status === 'completed') {
            clearInterval(checkInterval);
            resolve();
          }

          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            reject(new Error('Transaction verification timeout'));
          }
        } catch (error) {
          clearInterval(checkInterval);
          reject(error);
        }
      }, 3000); // Check every 3 seconds
    });
  }

  // Add this method to check premium status on init
  private checkPremiumStatus(): void {
    const premiumStatus = localStorage.getItem('premiumStatus');
    if (premiumStatus) {
      const status = JSON.parse(premiumStatus);
      if (status.expiry > new Date().getTime()) {
        this.isPremiumUser = true;
        this.profile.premiumExpiry = status.expiry;
      } else {
        // Premium expired
        localStorage.removeItem('premiumStatus');
        this.isPremiumUser = false;
        this.profile.premiumExpiry = null;
      }
    }
  }

  async connectWallet(): Promise<void> {
    try {
      await this.tonConnect.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }
}
