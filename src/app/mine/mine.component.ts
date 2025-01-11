import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.component.html',
  styleUrls: ['./mine.component.css'],
})
export class MineComponent {
  profile = { balance: 0, power: 12200 }; // Initial balance is set to 0
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDeviceInformation();
    this.calculateElapsedTime();
    setInterval(() => this.calculateElapsedTime(), 1000 * 60);
    const savedMiningState = localStorage.getItem('miningState');
    if (savedMiningState) {
      const state = JSON.parse(savedMiningState);
      if (state.isMining) {
        this.isMining = true;
        this.bandwidth.status = 'Active';
        this.bandwidth.statusColor = 'green';
        this.buttonLabel = 'Stop Mining';
        this.miningStartTime = state.miningStartTime;
        this.startSpeedCheck();
      }
    } // Update elapsed time every minute
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

  // updatePowerDots(): void {
  //   const dotsToUpdate = Math.min(this.elapsedHours, 6); // Only 6 dots max
  //   this.powerDots = ['dot', 'dot', 'dot', 'dot', 'dot', 'dot']; // Reset to default
  //   for (let i = 0; i < dotsToUpdate; i++) {
  //     this.powerDots[i] = `dot red`; // Red color for elapsed hours
  //   }
  //   for (let i = dotsToUpdate; i < 6; i++) {
  //     this.powerDots[i] = `dot green`; // Green color for remaining dots
  //   }

  //   if (this.elapsedHours >= 6) {
  //     this.powerStatusColor = 'red'; // Show cooldown when 6 hours are completed
  //   }
  // }
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

    // Clear mining state
    localStorage.removeItem('miningState');
  }

  handleClaim(): void {
    if (this.elapsedHours >= 6) {
      this.isClaiming = true;
      this.profile.balance = this.bandwidth.earned; // Add the earned tokens to the balance
      setTimeout(() => {
        this.isClaiming = false;
        this.bandwidth.shares = 0;
        this.bandwidth.earned = 0;
        this.miningStartTime = null;
        this.elapsedHours = 0;
        alert('Tokens claimed successfully!');
        this.startMiningCooldown();
      }, 2000); // Simulate claim API delay
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
      // console.log('Speed results:', this.results);

      // Update shares and earned based on the speed
      const totalMbps = results.reduce(
        (sum, result) => sum + Number(result.mbps),
        0
      );
      this.accumulatedShares += totalMbps;
      if (this.accumulatedShares > 60) this.accumulatedShares = 60; // Cap shares
      this.bandwidth.shares = this.accumulatedShares;
      this.bandwidth.earned = Math.floor(this.accumulatedShares / 5);
      if (this.bandwidth.earned > 0) this.bandwidth.status = 'Active';
    } catch (error) {
      console.error('Error in speed check:', error);
    }
  }

  // profile = { balance: 0, power: 12200 }; // Initial balance is set to 0
  // bandwidth = {
  //   status: 'Inactive',
  //   shares: 0,
  //   earned: 0,
  //   statusColor: 'red'  // Add this line to define the statusColor property
  // };
  // isMining = false;
  // isClaiming = false;
  // buttonLabel = 'Start Mining';
  // miningStartTime: number | null = null;
  // elapsedHours = 0;
  // accumulatedShares = 0;
  // speedCheckTimer: any;
  // results: any[] = []; // For storing network speed results
  // claimTimer: any; // For managing the 3-hour cooldown after claiming
  // miningCooldown = false; // To handle 3-hour cooldown
  // powerStatusColor = 'red'; // Default to red for low power

  // // New properties for Information card
  // deviceType: string = 'Unknown';
  // ip: string = 'Fetching...';

  // constructor(private http: HttpClient) { }

  // ngOnInit(): void {
  //   this.fetchDeviceInformation();
  //   this.calculateElapsedTime();
  //   setInterval(() => this.calculateElapsedTime(), 1000 * 60); // Update elapsed time every minute
  // }

  // fetchDeviceInformation(): void {
  //   this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe(
  //     (response) => {
  //       this.ip = response.ip;
  //     },
  //     (error) => {
  //       console.error('Error fetching IP:', error);
  //       this.ip = 'Error';
  //     }
  //   );

  //   const userAgent = navigator.userAgent;
  //   if (/mobile/i.test(userAgent)) {
  //     this.deviceType = 'Mobile';
  //   } else if (/tablet/i.test(userAgent)) {
  //     this.deviceType = 'Tablet';
  //   } else {
  //     this.deviceType = 'Desktop';
  //   }
  // }

  // calculateElapsedTime(): void {
  //   if (this.miningStartTime) {
  //     const now = new Date().getTime();
  //     this.elapsedHours = Math.floor((now - this.miningStartTime) / (1000 * 60 * 60));
  //   }
  // }

  // handleMiningToggle(): void {
  //   if (this.isMining) {
  //     this.stopMining();
  //   } else {
  //     this.startMining();
  //   }
  // }

  // startMining(): void {
  //   if (this.miningCooldown) {
  //     alert('Mining is on cooldown. Please try again after 3 hours.');
  //     return;
  //   }

  //   this.isMining = true;
  //   this.bandwidth.status = 'Active';
  //   this.bandwidth.statusColor = 'green'; // Set the color to green when active
  //   this.buttonLabel = 'Stop Mining';
  //   this.miningStartTime = new Date().getTime();
  //   this.startSpeedCheck();
  // }

  // stopMining(): void {
  //   this.isMining = false;
  //   this.bandwidth.status = 'Inactive';
  //   this.bandwidth.statusColor = 'red'; // Set the color to red when inactive
  //   this.buttonLabel = 'Start Mining';
  //   clearTimeout(this.speedCheckTimer);
  // }

  // handleClaim(): void {
  //   if (this.elapsedHours >= 6) {
  //     this.isClaiming = true;
  //     this.profile.balance = this.bandwidth.earned; // Add the earned tokens to the balance
  //     setTimeout(() => {
  //       this.isClaiming = false;
  //       this.bandwidth.shares = 0;
  //       this.bandwidth.earned = 0;
  //       this.miningStartTime = null;
  //       this.elapsedHours = 0;
  //       alert('Tokens claimed successfully!');
  //       this.startMiningCooldown();
  //     }, 2000); // Simulate claim API delay
  //   }
  // }

  // startMiningCooldown(): void {
  //   this.miningCooldown = true;
  //   setTimeout(() => {
  //     this.miningCooldown = false;
  //     this.powerStatusColor = 'green'; // Restore power status color after 3 hours
  //     this.bandwidth.status = 'Inactive';
  //     this.bandwidth.statusColor = 'red'; // Reset to inactive color
  //   }, 1000 * 60 * 60 * 3); // 3 hours cooldown
  // }

  // startSpeedCheck(): void {
  //   this.speedCheckTimer = setTimeout(() => {
  //     this.measureSpeedInParallel();
  //     this.startSpeedCheck(); // Recursive call to continue the timer
  //   }, 6000); // 6 seconds
  // }

  // private async measureSpeed(): Promise<any> {
  //   const startTime = new Date().getTime();
  //   const imageUrl = 'assets/download.jpeg'; // Path to your image in the assets folder

  //   try {
  //     const response = await this.http
  //       .get(imageUrl, { observe: 'response', responseType: 'blob' })
  //       .toPromise();

  //     const endTime = new Date().getTime();
  //     const diff = (endTime - startTime) / 1000; // Time in seconds

  //     const contentLength = response.headers.get('content-length');
  //     if (!contentLength) {
  //       throw new Error('Content length is not available in the response headers.');
  //     }

  //     const bits = parseInt(contentLength, 10) * 8; // Convert bytes to bits
  //     const bps = (bits / diff).toFixed(2);
  //     const kbps = (Number(bps) / 1024).toFixed(2);
  //     const mbps = (Number(kbps) / 1024).toFixed(2);

  //     return { bps, kbps, mbps };
  //   } catch (error) {
  //     console.error('Error measuring speed:', error);
  //     return { bps: 0, kbps: 0, mbps: 0 };
  //   }
  // }

  // private async measureSpeedInParallel(): Promise<void> {
  //   const requests = [this.measureSpeed()];
  //   try {
  //     const results = await Promise.all(requests);
  //     this.results = results.map((res, index) => ({
  //       process: `Process 0${index + 1}`,
  //       bps: res.bps,
  //       kbps: res.kbps,
  //       mbps: res.mbps,
  //     }));
  //     console.log('Speed results:', this.results);

  //     // Update shares and earned based on the speed
  //     const totalMbps = results.reduce((sum, result) => sum + Number(result.mbps), 0);
  //     this.accumulatedShares += totalMbps;
  //     if (this.accumulatedShares > 60) this.accumulatedShares = 60; // Cap shares
  //     this.bandwidth.shares = this.accumulatedShares;
  //     this.bandwidth.earned = Math.floor(this.accumulatedShares / 5);
  //     if (this.bandwidth.earned > 12) this.bandwidth.earned = 12; // Cap tokens
  //   } catch (error) {
  //     console.error('Error measuring speed in parallel:', error);
  //   }
  // }

  // ngOnDestroy(): void {
  //   clearTimeout(this.speedCheckTimer);
  //   clearTimeout(this.claimTimer);
  // }

  // profile = {
  //   balance: 139.93,
  //   power: 12200,
  // };

  // powerDots = ['green', 'green', 'green', 'green', 'green'];
  // bandwidth = {
  //   status: 'Active',
  //   shares: 120,
  //   earned: 50,
  // };

  // buttonLabel = 'Start Earning';
  // isMining = false;

  // handleButtonClick() {
  //   this.isMining = !this.isMining;
  //   this.buttonLabel = this.isMining ? 'Stop Earning' : 'Start Earning';
  // }
  // completedHours = 0;
  // totalHours = 6;
  // miningInterval: any;

  // constructor(private http: HttpClient) { }

  // ngOnInit(): void {
  //   this.getIpAddress();
  //   this.getDeviceType();
  //   this.measureSpeedInParallel();
  //   this.startSpeedCheck();
  // }
  // startMining() {
  //   let completedDots = 0;
  //   const interval = setInterval(() => {
  //     if (completedDots < this.powerDots.length) {
  //       this.powerDots[completedDots] = 'red';
  //       this.profile.power -= 12200 / 6;
  //       completedDots++;
  //     } else {
  //       clearInterval(interval);
  //       this.buttonLabel = 'Claim';
  //       this.isMining = false;
  //     }
  //   }, 60 * 60 * 1000); // Change 1 hour (3600000 ms)
  // }
  // stopMining() {
  //   this.isMining = false;
  //   clearInterval(this.miningInterval);
  //   this.buttonLabel = 'Start Earning';
  // }

  // updatePowerDots() {
  //   // Change the next dot to red as time passes
  //   if (this.completedHours < this.totalHours) {
  //     this.powerDots[this.completedHours] = 'red';
  //   }
  // }

  // claimRewards() {
  //   this.profile.balance += 50;
  //   this.completedHours = 0;
  //   this.profile.power = 12200;
  //   this.powerDots = Array(6).fill('green'); // Reset dots to green
  //   this.buttonLabel = 'Start Earning';
  // }

  // private speedCheckTimer: any;
  // // // isMining = false;
  // ip: any;
  // deviceType: string = '';
  responseData!: any;

  // results: { process: string; bps: string; kbps: string; mbps: string }[] = [];
  // // downloadSize = 10500000; // bytes
  // progressMessage: string[] = [];
  // ngOnDestroy(): void {
  //   if (this.speedCheckTimer) {
  //     clearTimeout(this.speedCheckTimer);
  //   }
  // }

  // startSpeedCheck(): void {
  //   this.speedCheckTimer = setTimeout(() => {
  //     this.measureSpeedInParallel();
  //     this.startSpeedCheck(); // Recursive call to continue the timer
  //   }, 6000); // 60 seconds
  // }

  // private measureSpeed() {
  //   const startTime = new Date().getTime();
  //   const imageUrl = 'assets/download.jpeg'; // Path to your image in the assets folder

  //   return this.http.get(imageUrl, { observe: 'response', responseType: 'blob' }).toPromise().then((response) => {
  //     const endTime = new Date().getTime();
  //     const diff = (endTime - startTime) / 1000; // Time in seconds

  //     const contentLength = response.headers.get('content-length');
  //     if (!contentLength) {
  //       throw new Error('Content length is not available in the response headers.');
  //     }

  //     const bits = parseInt(contentLength, 10) * 8; // Convert bytes to bits

  //     const bps = (bits / diff).toFixed(2);
  //     const kbps = (Number(bps) / 1024).toFixed(2);
  //     const mbps = (Number(kbps) / 1024).toFixed(2);

  //     return { bps, kbps, mbps };
  //   });
  // }

  // private async measureSpeedInParallel() {
  //   const requests = [this.measureSpeed()];
  //   try {
  //     const results = await Promise.all(requests);
  //     this.results = results.map((res, index) => ({
  //       process: `Process 0${index + 1}`,
  //       bps: res.bps,
  //       kbps: res.kbps,
  //       mbps: res.mbps
  //     }));
  //   } catch (error) {
  //     console.error('Error measuring speed:', error);
  //   }
  // }
  // getIpAddress() {
  //   this.http.get("https://api.ipify.org?format=json").subscribe(res => {
  //     console.log("getIpAddress --->", res)
  //     // this.ip = res.ip
  //     this.responseData = res;
  //     this.ip = this.responseData.ip
  //   })
  // }
  // getDeviceType() {
  //   const userAgent = navigator.userAgent;

  //   if (/Mobi|Android/i.test(userAgent)) {
  //     this.deviceType = 'Mobile';
  //   } else if (/iPad|Tablet/i.test(userAgent)) {
  //     this.deviceType = 'Tablet';
  //   } else {
  //     this.deviceType = 'Desktop';
  //   }
  //   console.log("this.deviceType --->", this.deviceType)
  // }
}
