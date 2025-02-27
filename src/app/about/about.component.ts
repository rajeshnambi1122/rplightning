import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Import HttpClient
import { environment } from 'src/environments/environment';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'How The System Works',
    children: [
      {
        name: 'Earn Diamonds & Rewards',
        children: [
          { name: 'Based on your claims, you earn diamonds.' },
          { name: 'Earn diamonds by watching ads or clicking on them.' },
          { name: 'Clicking ads gives higher rewards than watching ads.' },
          { name: 'Your earnings depend on ad interactions and engagement.' },
          { name: 'We monitor ad views and clicks to ensure fair distribution.' }
        ]
      },
      {
        name: 'Final Rewards Distribution',
        children: [
          { name: 'Users with higher ad engagement earn more rewards.' },
          { name: 'Diamonds are converted into USDT directly in your wallet address.' }
        ]
      },
      {
        name: 'Important Notes',
        children: [
          { name: 'More ad interactions = More rewards.' },
          { name: 'Fraudulent or automated clicks will result in penalties.' },
          { name: 'Ensure active participation to maximize your earnings.' }
        ]
      }
    ]
  },
  {
    name: 'Modes Explained',
    children: [
      {
        name: 'Normal Mode',
        children: [
          { name: 'Earnings: 10 Diamonds per Hour' },
          { name: 'Daily Earnings: 240 Diamonds' },
          { name: 'Claim Requirement: Every 3 hours, claim 30 Diamonds' },
          { name: 'Ad Watching and Click Bonus: More rewards for clicks compared to ad watching' }
        ]
      },
      {
        name: 'Hybrid Mode',
        children: [
          { name: 'Activation Cost: 0.25 TON' },
          { name: 'Earnings: 25 Diamonds per Hour' },
          { name: 'Daily Earnings: 600 Diamonds' },
          { name: 'Claim Requirement: Every 3 hours, claim 75 Diamonds' },
          { name: 'Ad Watching and Click Bonus: More rewards for clicks compared to ad watching' },
          { name: 'Note: Hybrid Mode grants higher diamond earnings in exchange for TON payment.' }
        ]
      },
      {
        name: 'Dynamic Mode',
        children: [
          { name: 'Activation Cost: 0.5 TON' },
          { name: 'Earnings: 50 Diamonds per Hour' },
          { name: 'Daily Earnings: 1200 Diamonds' },
          { name: 'Claim Requirement: Every 3 hours, claim 150 Diamonds' },
          { name: 'Ad Watching and Click Bonus: More rewards for clicks compared to ad watching' },
          { name: 'Note: Dynamic Mode provides maximum diamond earnings in exchange for a higher TON payment.' }
        ]
      }
    ]
  },
  {
    name: 'Roadmap',
    children: [
      { name: 'Launch of Diamond Mining System' },
      { name: 'Achieve 100,000+ Registered Users' },
      { name: 'Introduce Hybrid & Dynamic Mining Modes for Optimized Earnings' },
      { name: 'Implement Secure Wallet Creation with 12-Word Seed Phrase & Email Verification' },
      { name: 'Integrate Ad-Based Revenue Model with Enhanced Click & Engagement Rewards' },
      { name: 'Roll Out Major Feature Update to Enhance User Experience' },
      { name: 'Enable Seamless Diamond-to-USDT Conversion Mechanism' }
    ]
  },
  {
    name: 'Diamond Economy',
    children: [
      { name: 'Total Diamonds in Circulation: Dynamic Supply' },
      { name: 'Normal Mode Earnings: 10 Diamonds per Hour (240 Daily)' },
      { name: 'Hybrid Mode Earnings: 25 Diamonds per Hour (600 Daily)' },
      { name: 'Dynamic Mode Earnings: 50 Diamonds per Hour (1200 Daily)' },
      { name: 'Diamond-to-USDT Conversion: Conversion rate is dynamic based on claiming diamonds, spending time in our bot, watching ads, and clicking ads. The exact rate will be revealed at the time of exchange.' }
    ],
  },
  {
    name: 'Airdrop Criteria ⚠️',
    children: [
      { name: 'NOTE: YOU ARE MINING DIAMONDS, WHICH CAN BE CONVERTED INTO USDT BASED ON THE EXCHANGE RATE.' },
      {
        name: 'Main Requirements:',
        children: [
          { name: 'Total Diamonds Earned' },
          { name: 'Minimum 200 Diamonds Required in Wallet for Conversion' },
          { name: 'Number of Referrals' },
          { name: 'Ad Click & Engagement Bonus' },
          { name: 'Honor Score Maintenance' }
        ]
      },
      { name: 'Are Diamonds Important? Yes! They determine your final USDT rewards.' }
    ]
  },
  {
    name: 'Investment',
    children: [
      { name: 'This investment will accelerate the expansion of our diamond-based mining ecosystem, enhancing user rewards and ad revenue.' }
    ],
  },
  {
    name: 'Privacy Policy',
    children: [
      { name: 'We collect user IDs, transactions, and interactions to enhance services.' },
      { name: 'Data is secured and not shared with third parties except as required by law.' },
      { name: 'Users can request data deletion via [Support Email].' },
      { name: 'By using this bot, you agree to our Privacy Policy.' }
    ]
  },
  {
    name: 'Terms & Conditions',
    children: [
      { name: 'Users must be 18+ to access this service.' },
      { name: 'Engaging in illegal activities or misuse leads to account termination.' },
      { name: 'Transactions are final, and we are not liable for financial losses.' },
      { name: 'We reserve the right to modify terms as necessary.' },
      { name: 'By using this bot, you accept these Terms & Conditions.' }
    ]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  apiUrl1 = environment.apiurl;
  miningDetails: any = null;
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private http: HttpClient) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    this.fetchMiningDetails();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  private getHeaders() {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });
    return { headers };
  }
  fetchMiningDetails() {
    const url = `${this.apiUrl1}task/supply`;
    this.http.get<any>(url, this.getHeaders()).subscribe(response => {
      // Store mining details separately
      this.miningDetails = {
        totalMined: `${response.percentage} %`,
        totalSupply: '500,000,000',
        totalHolders: response.userCount,
        miningStarted: '04-Feb-2025'
      };
    });
  }

}
