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
    children: [{ name: 'A Decentralized Network.// LIGHTING is an  dePIN Project on TELEGRAM MINI-APP. THATS WILL ANYLISE YOUR DATA SPEED..... TOKENS REWARDS ARE BASED ON THE USERS DATA SPEED. LIGHING revolutionizes token distribution by rewarding participants for sharing their Internet bandwidth. How it Works? //Simply put, you share your Internet bandwidth to power AI training and earn $LIGHT tokens in return. Rewards are distributed every 30 seconds, directly linked to your bandwidth speed, turning your idle resources into valuable ASSETS. //Total Supply:   50,000,000  $LIGHT //Reward Frequency: Every ~30 seconds, based on bandwidth speed. //Mining Duration: Until JUNE 2025 or until all tokens are mined //Once mining ends, all tokens will be distributed via the TON Blockchain, ensuring transparency and scalability. Join now and turn your bandwidth into LIGHT tokens before the opportunity runs out! Donations //Star and Ton purchased in-app will be allocated to cover expenses (Team, marketing, development, etc.).' }],
  },
  {
    name: 'Modes Explained',
    children: [
      {
        name: 'Normal Mode',
        children: [
          { name: 'Capacity: 12,000 Tokens' },
          { name: 'Daily Mining Rate: 12 Tokens' },
          { name: 'Mining Speed: 0.5 Tokens per Hour' },
          { name: 'Claim Requirement: Every 6 hours, claim 4 tokens' },
          { name: 'Claim Limit: Up to 3 claims per day' }
        ]
      },
      {
        name: 'Hyper Mode',
        children: [
          { name: 'Capacity: 36,000 Tokens' },
          { name: 'Daily Mining Rate: 36 Tokens' },
          { name: 'Mining Speed: 1.5 Tokens per Hour' },
          { name: 'Claim Requirement: Every 6 hours, claim 12 tokens' },
          { name: 'Claim Limit: Up to 3 claims per day' },
          { name: 'Activation Cost: 0.5 TON' },
          { name: 'Note: Activating Hyper Mode grants enhanced mining for 3 days, tripling both capacity and mining speed.' }
        ]
      },
      {
        name: 'Dynamic Mode',
        children: [
          { name: 'Capacity: 72,000 Tokens' },
          { name: 'Daily Mining Rate: 72 Tokens' },
          { name: 'Mining Speed: 3 Tokens per Hour' },
          { name: 'Claim Requirement: Every 6 hours, claim 24 tokens' },
          { name: 'Claim Limit: Up to 3 claims per day' },
          { name: 'Activation Cost: 2 TON' },
          { name: 'Note: Activating Dynamic Mode grants enhanced mining for 6 days, increasing capacity and mining speed by 6 times.' }
        ]
      }
    ]
  },
  {
    name: 'Roadmap',
    children: [{ name: 'Update Soon...' }],
  },
  {
    name: 'Tokenomic',
    children: [{ name: 'Airdrop for Miners: 70% (350,000,000)' }, { name: 'Team & Advisors: 10% (50,000,000)' },
    { name: 'Liquidity: 15% (75,000,000)' }, { name: 'Marketing: 5% (25,000,000)' }
    ],
  },
  {
    name: 'Investment',
    children: [{ name: 'This investment will fuel our mission to revolutionize AI development through decentralized data-sharing and reward our community.' }],
  },
  {
    name: 'Policy',
    children: [
      {
        name: '1. General Overview',
        children: [
          { name: 'This mining system provides users with structured token earning opportunities through three distinct mining modes: Normal, Hyper, and Dynamic.' }
        ]
      },
      {
        name: '2. Mining Modes & Token Distribution',
        children: [
          {
            name: 'a) Normal User Mode',
            children: [
              { name: 'Capacity: 12,000 Tokens' },
              { name: 'Daily Mining Rate: 12 Tokens' },
              { name: 'Mining Speed: 0.5 Tokens per Hour' },
              { name: 'Claiming: 4 Tokens every 6 hours (3 times per day)' },
              { name: 'Access: Free for all registered users' }
            ]
          },
          {
            name: 'b) Hyper Mode',
            children: [
              { name: 'Capacity: 36,000 Tokens' },
              { name: 'Daily Mining Rate: 36 Tokens' },
              { name: 'Mining Speed: 1.5 Tokens per Hour' },
              { name: 'Claiming: 12 Tokens every 6 hours (3 times per day)' },
              { name: 'Activation Cost: 0.5 TON' },
              { name: 'Duration: 3 Days' },
              { name: 'Benefits: 3× Capacity & Mining Speed' }
            ]
          },
          {
            name: 'c) Dynamic Mode',
            children: [
              { name: 'Capacity: 72,000 Tokens' },
              { name: 'Daily Mining Rate: 72 Tokens' },
              { name: 'Mining Speed: 3 Tokens per Hour' },
              { name: 'Claiming: 24 Tokens every 6 hours (3 times per day)' },
              { name: 'Activation Cost: 2 TON' },
              { name: 'Duration: 6 Days' },
              { name: 'Benefits: 6× Capacity & Mining Speed' }
            ]
          }
        ]
      },
      {
        name: '3. Claiming Mechanism',
        children: [
          { name: 'Tokens must be manually claimed at set intervals.' },
          { name: 'Claim window opens every 6 hours.' },
          { name: 'Users can claim up to 3 times per day.' }
        ]
      },
      {
        name: '4. Upgrade & Activation',
        children: [
          { name: 'Users can upgrade from Normal Mode to Hyper or Dynamic Mode by paying the required TON amount.' },
          { name: 'Upgraded modes activate immediately and last for the specified duration.' }
        ]
      },
      {
        name: '5. Fair Usage & Restrictions',
        children: [
          { name: 'Only one mining mode can be active at a time.' },
          { name: 'Unclaimed tokens do not roll over to the next claim period.' },
          { name: 'Automated mining or manipulation will result in account suspension.' }
        ]
      },
      {
        name: '6. Disclaimer',
        children: [
          { name: 'Mining speeds may vary due to network conditions.' },
          { name: 'Project reserves the right to modify policies to maintain ecosystem balance.' }
        ]
      }
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
