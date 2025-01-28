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
    children: [{name: '"Lighting" is a DePIN project on the Telegram mini-app. We will analyze your data speed, and token rewards will be based on your data speed. Once all the tokens are mined, they will be distributed to miners on the "TON Network" or other networks.'}],
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
    children: [{name: 'Update Soon...'}],
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
