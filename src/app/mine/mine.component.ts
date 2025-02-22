import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TonConnect } from '@tonconnect/sdk';
import { TonConnectUI, SendTransactionRequest } from '@tonconnect/ui';
import { Address, toNano } from 'ton-core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css']
})
export class MineComponent implements OnInit, OnDestroy {
  // Add premium user properties
  isPremiumUser: boolean = false;
  readonly PREMIUM_MAX_TOKENS_HYPER = 24; // Premium users in hyper mode can earn 24 tokens per day
  readonly PREMIUM_MAX_TOKENS_DYNAMIC = 36; // Premium users in dynamic mode can earn 36 tokens per day
  readonly REGULAR_MAX_TOKENS = 12; // Regular users stay at 12 tokens per day
  PREMIUM_MAX_TOKENS: number = this.REGULAR_MAX_TOKENS; // Default to regular tokens

  // Update profile to include premium status
  profile = {
    balance: 0,
    power: 12200,
    premiumExpiry: null as number | null,
    lastMiningTime: null as number | null
  };

  bandwidth = {
    status: 'Inactive',
    shares: 0,
    earned: 0,
    statusColor: 'red' // Add this line to define the statusColor property
  };
  isMining: boolean = false;
  isClaiming: boolean = false;
  buttonLabel = 'Start Mining';
  elapsedSeconds: number = 0; // Changed from elapsedHours
  accumulatedShares = 0;
  speedCheckTimer: any;
  results: any[] = []; // For storing network speed results
  claimTimer: any; // For managing the 3-hour cooldown after claiming
  miningCooldown = false; // To handle 3-hour cooldown
  powerStatusColor = 'red'; // Default to red for low power
  powerDots = ['dot', 'dot', 'dot', 'dot', 'dot', 'dot']; // Default 6 dots (all grey)

  deviceType: string = 'Unknown';
  ip: string = 'Fetching...';
  apiUrl = environment.apiurl;

  // Add TON Connect properties
  private tonConnect!: TonConnectUI;
  walletAddress: string | null = null;
  tokenBalance: number = 0; // Add token balance
  Chat_ID: any;
  ChatIDDAta: any;
  userDetails: any;
  private timerInterval: any; // Add this to track the interval
  upgradedMode: string | null = null; // Declare upgradedMode property
  // refreshService: any;

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: ActivatedRoute,
    private refreshService: SharedService
  ) {
  }

  ngOnInit(): void {
    let tokenValidation = localStorage.getItem('Identification')
    console.log("tokenValidation --->",tokenValidation == "null")
    if(tokenValidation == "null"){
      this.ChatIDDAta = this.router.snapshot.paramMap.get('id');
      localStorage.setItem('Identification', this.ChatIDDAta);
     
    }
    else{
      this.Chat_ID = localStorage.getItem('Identification');
    }
    
    console.log('this.Chat_ID --->', this.Chat_ID);
    this.getUserDetails();
    this.newFunction();
    this.checkPremiumStatus(); // Check premium status on init
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });
    return { headers };
  }
  getUserDetails() {
    console.log("this.Chat_ID 123*** -->",this.Chat_ID)
    const url = `${this.apiUrl}webhook/getUserDetail/${this.Chat_ID}`;

    this.http.get<any>(url, this.getHeaders()).subscribe(result => {
      if (result) {
        console.log('GET API RESPONSE --->', result);
        this.userDetails = result;
        if(result.premiumStatus == null){
          this.initialPlanUpgrade()
        }
        this.profile.balance = result.balance ? parseFloat(result.balance) : 0;

        // Check premium status from the result
        const premiumStatus = result.premiumStatus;
        if (premiumStatus) {
          this.isPremiumUser = premiumStatus.isPremium; // Set premium status
          this.upgradedMode = premiumStatus.mode; // Set upgraded mode

          // Calculate premium expiry time (72 hours from levelUpdateAt)
          const levelUpdateAt = new Date(result.levelUpdateAt).getTime();
          const expiryTime = levelUpdateAt + 72 * 60 * 60 * 1000; // 72 hours in milliseconds
          this.profile.premiumExpiry = expiryTime; // Set premium expiry

          // Check if the premium is still valid
          if (expiryTime < Date.now()) {
            this.isPremiumUser = false; // Set to false if expired
            this.profile.premiumExpiry = null; // Clear expiry
          } else {
            // Set maximum tokens based on mode
            if (premiumStatus.mode === 'hyper') {
              this.PREMIUM_MAX_TOKENS = this.PREMIUM_MAX_TOKENS_HYPER;
            } else if (premiumStatus.mode === 'dynamic') {
              this.PREMIUM_MAX_TOKENS = this.PREMIUM_MAX_TOKENS_DYNAMIC;
            }
          }
        }
      } else {
        console.error('Referral ID not found in response', result);
      }
    });
  }
   initialPlanUpgrade(){
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpOptions = { headers: headers_object };
    // let param = { mode: "hyper" }
    let param = { isPremium: true,mode: "normal" }
    this.http.put<any>(this.apiUrl + "webhook/upgrade/" + this.Chat_ID, param, httpOptions).subscribe(
      (response) => {
        this.getUserDetails()

      },
      (error) => {
        console.error('Error claiming reward:', error);
        // Optionally show error message in the UI
      }
    );
  }
  newFunction() {
    this.walletAddress = window.walletState.address;
    this.isPremiumUser = window.walletState.isPremium;
    this.profile.premiumExpiry = window.walletState.premiumExpiry;

    // Set up interval to check wallet state
    setInterval(() => {
      if (this.walletAddress !== window.walletState.address) {
        this.walletAddress = window.walletState.address;
        this.isPremiumUser = window.walletState.isPremium;
        this.profile.premiumExpiry = window.walletState.premiumExpiry;
      }
    }, 1000);

    // Restore mining progress from localStorage
    // console.log("BEFORE savedProgress --->", this.userDetails.miningProgress)
    const savedProgress = this.userDetails?.miningProgress;
    if (savedProgress) {
      console.log('after savedProgress --->', savedProgress);

      this.bandwidth.shares = savedProgress.shares || 0;
      this.bandwidth.earned = savedProgress.earned || 0;
      this.accumulatedShares = savedProgress.accumulatedShares || 0;
    } else {
      console.log('No mining progress found.');
    }
    // const savedProgress = this.userDetails.miningProgress;
    // console.log("after savedProgress --->", savedProgress)
    // if (savedProgress) {
    //   const progress = savedProgress;
    //   this.bandwidth.shares = progress.shares;
    //   this.bandwidth.earned = progress.earned;
    //   this.accumulatedShares = progress.accumulatedShares;
    // }

    this.fetchDeviceInformation();
    this.calculateElapsedTime();
    this.startTimer();

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
          this.profile.lastMiningTime = state.miningStartTime;
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
        response => {
          this.ip = response.ip;
        },
        error => {
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
    if (this.profile.lastMiningTime) {
      const now = new Date().getTime();
      this.elapsedSeconds = Math.floor(
        (now - this.profile.lastMiningTime) / 1000 // Changed from hours
      );
      this.updatePowerDots(); // Update power dots based on elapsed hours
    }
  }

  updatePowerDots(): void {
    const dotsToUpdate = Math.min(this.elapsedSeconds, 6); // Only 6 dots max
    const initialPower = 12200; // Initial power value
    const reductionPerHour = 2033; // Power reduction per hour
    let reducedPower = initialPower - this.elapsedSeconds * reductionPerHour;

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

    if (this.elapsedSeconds >= 6) {
      this.powerStatusColor = 'red'; // Show cooldown when 6 hours are completed
    }
  }

  async handleMiningToggle(): Promise<void> {
    if (!this.isMining) {
      // Start mining
      this.isMining = true;
      this.bandwidth.status = 'Active';
      this.bandwidth.statusColor = 'green';
      this.profile.lastMiningTime = new Date().getTime();
      this.elapsedSeconds = 0;
   
      // Save mining state
      localStorage.setItem(
        'miningState',
        JSON.stringify({
          isMining: true,
          miningStartTime: this.profile.lastMiningTime
        })
      );

      this.startSpeedCheck();
    } else {
      // Stop mining
      this.isMining = false;
      this.bandwidth.status = 'Cooling Down...';
      this.bandwidth.statusColor = 'orange';
      
      // Start 3-second cooldown
      setTimeout(() => {
        this.bandwidth.status = 'Inactive';
        this.bandwidth.statusColor = 'red';
      }, 3000);

      // Clear mining state but keep progress
      localStorage.removeItem('miningState');
      clearTimeout(this.speedCheckTimer);
    }
  }

  async handleClaim(): Promise<void> {
    if (this.isClaiming) return;
  
    try {
      this.isClaiming = true;
      // const httpOptions = 
      // Show cooling down status
      this.bandwidth.status = 'Cooling Down...';
      this.bandwidth.statusColor = 'orange';

      // Add 3 second cooldown period
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Determine tokens earned based on mode
      let tokensEarned = 0;
      if (this.isPremiumUser) {
        if (this.upgradedMode === 'hyper') {
          tokensEarned = 12; // Hyper mode earns 12 tokens per claim
        } else if (this.upgradedMode === 'dynamic') {
          tokensEarned = 18; // Dynamic mode earns 18 tokens per claim
        }
      } else {
        tokensEarned = 6; // Regular users earn 6 tokens per claim
      }

      // Update the profile balance
      // this.profile.balance += tokensEarned; // Update balance

      // alert(
      //   `Claimed ${tokensEarned} tokens successfully! New balance: ${this.profile.balance}`
      // );
     
      this.http.put<any>(this.apiUrl + "webhook/balanceUpdate/" + this.Chat_ID + "/" + tokensEarned + "/1", {}).subscribe(
        (response) => {})
      // Reset bandwidth sharing stats
      this.bandwidth.shares = 0;
      this.bandwidth.earned = 0;
      this.accumulatedShares = 0;

      // Update status after claiming and cooldown
      this.bandwidth.status = 'Inactive';
      this.bandwidth.statusColor = 'red';

      // Save the mined tokens to the server
      const headers_object = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      const param = {
        shares: 0,
        earned: tokensEarned, // Pass the currently mined tokens
        accumulatedShares: this.accumulatedShares
      };
      const httpOptions = { headers: headers_object };
      await this.http
        .put<any>(
          `${this.apiUrl}webhook/mining-progress/${this.Chat_ID}`,
          param,
          httpOptions
        )
        .toPromise();
        this.refreshService.triggerRefresh();
this.getUserDetails();
      // Reset mining timer
      this.profile.lastMiningTime = new Date().getTime();
      this.elapsedSeconds = 0;
    } catch (error) {
      console.error('Failed to claim tokens:', error);
      alert('Failed to claim tokens. Please try again.');
    } finally {
      this.isClaiming = false;
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
    this.profile.lastMiningTime = new Date().getTime();

    // Save mining state
    localStorage.setItem(
      'miningState',
      JSON.stringify({
        isMining: true,
        miningStartTime: this.profile.lastMiningTime
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
    }, 1000); // Changed to 1 second interval
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
        mbps: res.mbps
      }));

      // Update shares and earned based on time (1 token per second)
      this.accumulatedShares += 1; // Increment by 1 each second
      if (this.accumulatedShares >= 6) {
        this.accumulatedShares = 6; // Cap at 6 shares
        this.bandwidth.shares = this.accumulatedShares;
        this.bandwidth.earned = this.accumulatedShares;

        // Stop mining when we reach 6 shares/seconds
        this.stopMining();
        this.bandwidth.status = 'Ready to Claim';
        this.bandwidth.statusColor = 'green';
        this.buttonLabel = 'Claim Tokens';
      } else {
        this.bandwidth.shares = this.accumulatedShares;
        this.bandwidth.earned = this.accumulatedShares;
      }

      // Apply premium/regular token caps
      const maxTokens = this.isPremiumUser
        ? this.PREMIUM_MAX_TOKENS
        : this.REGULAR_MAX_TOKENS;
      if (this.bandwidth.earned > maxTokens) {
        this.bandwidth.earned = maxTokens;
      }

      // Save progress to localStorage
      // localStorage.setItem(
      //   'miningProgress',
      //   JSON.stringify({
      //     shares: this.bandwidth.shares,
      //     earned: this.bandwidth.earned,
      //     accumulatedShares: this.accumulatedShares,
      //   })
      // );
      var headers_object = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      let param = {
        shares: this.bandwidth.shares,
        earned: this.bandwidth.earned,
        accumulatedShares: this.accumulatedShares
      };
      const httpOptions = { headers: headers_object };
      this.http
        .put<any>(
          this.apiUrl + 'webhook/mining-progress/' + this.Chat_ID,
          param,
          httpOptions
        )
        .subscribe(result => {});
    } catch (error) {
      console.error('Error in speed check:', error);
    }
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
      // The button will handle the connection automatically
      // No need for additional connection logic here
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }

  private startTimer() {
    // Clear any existing interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.isMining && this.profile.lastMiningTime) {
        const now = new Date().getTime();
        this.elapsedSeconds = Math.floor(
          (now - this.profile.lastMiningTime) / 1000
        );
      }
    }, 1000);
  }

  // Clean up when component is destroyed
  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
