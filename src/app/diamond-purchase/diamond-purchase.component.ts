import { Component } from '@angular/core';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-diamond-purchase',
  template: `
    <div class="purchase-container">
      <div class="floating-diamonds">
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
        <span class="floating-diamond">💎</span>
      </div>
      <div class="packages">
        <div class="package-card" *ngFor="let pack of packages">
          <div class="diamond-header">
            <h2>{{ pack.name }}</h2>
            <span class="diamond-icon">{{ '💎'.repeat(pack.iconCount) }}</span>
          </div>
          <div class="package-details">
            <div class="amount">{{ pack.diamonds }} Diamonds</div>
            <div class="price">{{ pack.ton }} TON</div>
            <button
              class="purchase-btn"
              (click)="purchaseDiamonds(pack.ton, pack.diamonds)"
            >
              <span>Purchase Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .purchase-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0a1b44;
        padding: 8px;
      }
      .packages {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        max-width: 400px;
        width: 100%;
        padding: 8px;
      }
      .package-card {
        background: rgba(19, 36, 77, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }
      .diamond-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      h2 {
        color: white;
        margin: 0;
        font-size: 14px;
      }
      .diamond-icon {
        font-size: 16px;
      }
      .package-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: center;
      }
      .amount {
        color: #28a7f0;
        font-size: 14px;
        font-weight: bold;
      }
      .price {
        color: white;
        font-size: 12px;
        opacity: 0.9;
      }
      .purchase-btn {
        background: linear-gradient(135deg, #3498db, #2475a8);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: all 0.3s ease;
        box-shadow: 0 1px 4px rgba(52, 152, 219, 0.3);
      }
      .purchase-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
      }
      .floating-diamonds {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }
      .floating-diamond {
        position: absolute;
        font-size: 24px;
        opacity: 0.15;
        animation: float 15s infinite linear;
      }
      .floating-diamond:nth-child(1) {
        left: 10%;
        animation-duration: 18s;
        animation-delay: -2s;
      }
      .floating-diamond:nth-child(2) {
        left: 30%;
        animation-duration: 15s;
        animation-delay: -5s;
      }
      .floating-diamond:nth-child(3) {
        left: 50%;
        animation-duration: 12s;
        animation-delay: -7s;
      }
      .floating-diamond:nth-child(4) {
        left: 70%;
        animation-duration: 16s;
        animation-delay: -3s;
      }
      .floating-diamond:nth-child(5) {
        left: 90%;
        animation-duration: 14s;
        animation-delay: -6s;
      }
      @keyframes float {
        0% {
          transform: translateY(100vh) rotate(0deg);
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
        }
      }
      .packages {
        position: relative;
        z-index: 1;
      }
    `,
  ],
})
export class DiamondPurchaseComponent {
  packages = [
    { name: 'Starter', diamonds: 100, ton: 0.13, iconCount: 1 },
    { name: 'Basic', diamonds: 310, ton: 0.6, iconCount: 2 },
    { name: 'Popular', diamonds: 520, ton: 0.9, iconCount: 2 },
    { name: 'Pro', diamonds: 1060, ton: 1.5, iconCount: 3 },
    { name: 'Elite', diamonds: 2180, ton: 2.2, iconCount: 3 },
    { name: 'Ultimate', diamonds: 5600, ton: 9, iconCount: 4 },
  ];

  async purchaseDiamonds(amount: number, diamonds: number) {
    try {
      const tonAmount = toNano(amount.toString());
      const receiverAddress =
        'EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI';

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: receiverAddress,
            amount: tonAmount.toString(),
          },
        ],
      };

      const result = await window.tonConnectUI.sendTransaction(transaction);
      if (result) {
        const currentDiamonds = Number(localStorage.getItem('diamonds') || '0');
        localStorage.setItem(
          'diamonds',
          (currentDiamonds + diamonds).toString()
        );
        alert(`Successfully purchased ${diamonds} diamonds!`);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  }
}
