import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { UpdateDialogBoxComponent } from './update-dialog-box/update-dialog-box.component';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'How The System Works',
    children: [{name: 'A Decentralized Network. THATS WILL ANYLISE YOUR DATA SPEED..... TOKENS REWARDS ARE BASED ON THE USERS DATA SPEED. LIGHING revolutionizes token distribution by rewarding participants for sharing their Internet bandwidth. How it Works? //Simply put, you share your Internet bandwidth to power AI training and earn $LIGHT tokens in return. Rewards are distributed every 30 seconds, directly linked to your bandwidth speed, turning your idle resources into valuable ASSETS. //Total Supply:   50,000,000  $LIGHT //Reward Frequency: Every ~30 seconds, based on bandwidth speed. //Mining Duration: Until JUNE 2025 or until all tokens are mined //Once mining ends, all tokens will be distributed via the TON Blockchain, ensuring transparency and scalability. Join now and turn your bandwidth into LIGHT tokens before the opportunity runs out! Donations //Star and Ton purchased in-app will be allocated to cover expenses (Team, marketing, development, etc.).'}],
  },
  {
    name: 'Modes Explained',
    children: [{name: 'Update Soon...'}],
  },
  {
    name: 'Roadmap',
    children: [{name: 'Update Soon...'}],
  },
  {
    name: 'Tokenomic',
    children: [{name: 'Airdrop for Miners: 70% (350,000,000)'},{name: 'Team & Advisors: 10% (50,000,000)'},
      {name: 'Liquidity: 15% (75,000,000)'},{name: 'Marketing: 5% (25,000,000)'}
    ],
  },
  {
    name: 'Investment',
    children: [{name: 'This investment will fuel our mission to revolutionize AI development through decentralized data-sharing and reward our community.'}],
  },
  {
    name: 'Policy',
    children: [{name: 'Update Soon...'}],
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
export class AboutComponent {
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

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
