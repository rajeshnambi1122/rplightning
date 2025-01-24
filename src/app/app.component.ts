import { Component, OnInit } from '@angular/core';
import { TonConnectUI } from '@tonconnect/ui';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.subscribe(() => {
      // Set condition to hide navbar for specific routes
      const currentRoute = this.router.url;
      // this.showBottomNavbar = currentRoute !== '/admin-login-page || /user-details';
      const excludedRoutes = [
        '/admin-login-page',
        '/admin-portal/user-details',
      ];

      this.showBottomNavbar = !excludedRoutes.includes(currentRoute);
    });
  }

  ngOnInit() {
    // Initialize wallet state
    window.walletState = {
      address: null,
      isPremium: false,
      premiumExpiry: null,
      tokenBalance: 0,
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
        window.walletState.tokenBalance = 0;
        this.tokenBalance = 0;
      }
    });

    // Load initial token balance
    this.loadTokenBalance();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Reset scroll position to the top
      }
    });
  }

  private loadTokenBalance() {
    const savedBalance = localStorage.getItem('profileBalance');
    if (savedBalance) {
      this.tokenBalance = parseFloat(savedBalance);
      window.walletState.tokenBalance = this.tokenBalance;
    }
  }

  shouldShowBalance(): boolean {
    return (
      !(
        this.router.url.startsWith('/admin-portal') ||
        ['/mine', '/about', '/admin-login-page'].includes(this.router.url)
      ) && window.walletState?.address !== null
    );
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
