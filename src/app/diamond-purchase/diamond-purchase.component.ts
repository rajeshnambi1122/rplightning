import { Component } from '@angular/core';
import { toNano } from 'ton-core';

@Component({
  selector: 'app-diamond-purchase',
  template: `
    <div class="purchase-container">
      <div class="packages">
        <div class="package-card">
          <div class="diamond-header">
            <h2>Basic Pack</h2>
            <span class="diamond-icon">💎</span>
          </div>
          <div class="package-details">
            <div class="amount">100 Diamonds</div>
            <div class="price">0.5 TON</div>
            <button class="purchase-btn" (click)="purchaseDiamonds(0.5, 100)">
              <span>Purchase Now</span>
            </button>
          </div>
        </div>

        <div class="package-card premium">
          <div class="diamond-header">
            <h2>Premium Pack</h2>
            <span class="diamond-icon">💎💎</span>
          </div>
          <div class="package-details">
            <div class="amount">200 Diamonds</div>
            <div class="price">1 TON</div>
            <button class="purchase-btn" (click)="purchaseDiamonds(1, 200)">
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
        padding: 20px;
      }
      .packages {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .package-card {
        background: rgba(19, 36, 77, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        width: 100%;
        max-width: 280px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      }
      .package-card.premium {
        background: rgba(25, 45, 95, 0.95);
        border: 1px solid rgba(52, 152, 219, 0.3);
      }
      .diamond-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      h2 {
        color: white;
        margin: 0;
        font-size: 24px;
      }
      .diamond-icon {
        font-size: 28px;
      }
      .package-details {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
      }
      .amount {
        color: #28a7f0;
        font-size: 24px;
        font-weight: bold;
      }
      .price {
        color: white;
        font-size: 20px;
        opacity: 0.9;
      }
      .purchase-btn {
        background: linear-gradient(135deg, #3498db, #2475a8);
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
      }
      .purchase-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
      }
    `,
  ],
})
export class DiamondPurchaseComponent {
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
