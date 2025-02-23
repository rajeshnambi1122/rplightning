import { Component, HostListener, OnInit } from '@angular/core';
import { TonConnectUI } from '@tonconnect/ui';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BadgeService, BadgeLevel } from './shared/badge.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from './shared.service';

declare global {
  interface Window {
    tonConnectUI: TonConnectUI;
    walletState: {
      address: string | null;
      isPremium: boolean;
      premiumExpiry: number | null;
      tokenBalance: number;
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
  showBottomNavbar: boolean = true;
  currentRoute: string = '';
  tokenBalance: number = 0;
  Chat_ID: any;
  balance: any;
  diamond: any;
  currentBadge!: BadgeLevel;
  ChatIDDAta: any;
  apiUrl = environment.apiurl;
  constructor(
    private router: Router,
    private router1: ActivatedRoute,
    private badgeService: BadgeService,
    private dialog: MatDialog,
    private http: HttpClient,
    private refreshService: SharedService  ) {
    // Listen to route changes
    this.router.events.subscribe(() => {
      // Set condition to hide navbar for specific routes
      const currentRoute = this.router.url;
      // this.showBottomNavbar = currentRoute !== '/admin-login-page || /user-details';
      // Check if the route matches `/wallet-main-page/{chatId}`

      // Define excluded routes
      const excludedRoutes = [
        '/admin-login-page',
        '/admin-portal/user-details',
        '/wallet-main-page',
      ];
      const isWalletPage = currentRoute.startsWith('/wallet-main-page/');

      // Hide navbar for excluded routes
      this.showBottomNavbar =
        !excludedRoutes.includes(currentRoute) && !isWalletPage;
      // const excludedRoutes = [
      //   '/admin-login-page',
      //   '/admin-portal/user-details',
      //   '/wallet-main-page','/wallet-main-page/`${this.Chat_ID}'
      // ];

      // this.showBottomNavbar = !excludedRoutes.includes(currentRoute);
    });
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  @HostListener('gesturestart', ['$event'])
  onGestureStart(event: Event): void {
    event.preventDefault();
  }
  routeSetting() {
    this.router.navigate(['setting']);
  }
  ngOnInit() {
    // this.Chat_ID = localStorage.getItem('Identification');
    let tokenValidation = localStorage.getItem('Identification')
    console.log("tokenValidation --->",tokenValidation == "null")
    if(tokenValidation == "null"){
      this.ChatIDDAta = this.router1.snapshot.paramMap.get('id');
      localStorage.setItem('Identification', this.ChatIDDAta);
     
    }
    else{
      this.Chat_ID = localStorage.getItem('Identification');
    }
    console.log('this.Chat_ID --->', this.Chat_ID);
    this.getUserDetails();
    this.refreshService.refresh$.subscribe(() => {
      // this.getUserDetails();
      this.refreshComponent();
    });
    // this.initialPlanUpgrade();
    // Initialize TON Connect once at app startup
    if (window.tonConnectUI) {
      window.tonConnectUI.uiOptions = {
        buttonRootId: 'ton-connect-button',
      };

      // Load saved wallet state
      const savedWalletState = localStorage.getItem('walletState');
      if (savedWalletState) {
        window.walletState = JSON.parse(savedWalletState);
        if (!window.tonConnectUI.connected) {
          window.tonConnectUI.connectWallet();
        }
      }

      // Listen for wallet changes
      window.tonConnectUI.onStatusChange((wallet) => {
        if (wallet) {
          window.walletState = {
            ...window.walletState,
            address: wallet.account.address,
          };
          localStorage.setItem(
            'walletState',
            JSON.stringify(window.walletState)
          );
        }
      });
    }
    this.loadTokenBalance();
    // Initialize wallet state
    // this.Chat_ID = this.router1.snapshot.paramMap.get('id');
    console.log('this.Chat_ID --->', this.Chat_ID);
    window.walletState = {
      address: null,
      isPremium: false,
      premiumExpiry: null,
      tokenBalance: this.balance,
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
        this.loadTokenBalance();
      } else {
        window.walletState.address = null;
        window.walletState.isPremium = false;
        window.walletState.premiumExpiry = null;
        window.walletState.tokenBalance = this.balance;
        this.tokenBalance = this.balance;
        this.loadTokenBalance();
      }
    });

    // Load initial token balance
    this.loadTokenBalance();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Reset scroll position to the top
      }
    });

    this.updateBadge();
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420',
    });
    return { headers };
  }
  getUserDetails() {
    console.log("this.Chat_ID 123456*** -->",this.Chat_ID)
    const url = `${this.apiUrl}webhook/getUserDetail/${this.Chat_ID}`;

    this.http.get<any>(url, this.getHeaders()).subscribe((result) => {
      if (result) {
        this.balance = result.balance;
        this.diamond = result.diamond;
        this.loadTokenBalance()
      } else {
        console.error('Refferal ID not found in response', result);
      }
    });
  }
  refreshComponent(){
    this.getUserDetails()
  }
  private loadTokenBalance() {
    const savedBalance = this.balance;
    if (savedBalance) {
      this.tokenBalance = savedBalance;
      window.walletState.tokenBalance = this.tokenBalance;
    }
  }

  shouldShowBalance(): boolean {
    return (
      !(
        this.router.url.startsWith('/admin-portal') ||
        [
          '/upgrade',
          '/friends',
          '/about',
          '/wallet',
          '/setting',
          '/admin-login-page',
          '/wallet-main-page/:id',
        ].includes(this.router.url) ||
        this.router.url.startsWith('/wallet-main-page')
      )
    );
  }
  // && window.walletState?.address !== null
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

  private updateBadge() {
    const tokens = this.tokenBalance;
    // const diamonds = parseInt(localStorage.getItem('diamonds') || '0');
    const diamonds = this.diamond
    this.currentBadge = this.badgeService.getCurrentBadge(tokens, diamonds);
  }

  // showBadgeInfo() {
  //   this.dialog.open(BadgeInfoDialogComponent, {
  //     data: this.currentBadge,
  //     width: '300px',
  //   });
  // }

  getDiamonds(): number {
    return this.diamond;
  }

  routeToDiamondPurchase() {
    this.router.navigate(['/diamond-purchase']);
  }
}
