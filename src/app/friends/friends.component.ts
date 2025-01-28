import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent {
  selectedTab: string = 'invite';

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  invitedUsers = new MatTableDataSource([
    { name: 'Lighting', dateReferred: new Date(), earned: 20 },
    { name: 'Jane Smith', dateReferred: new Date('2025-01-01') , earned: 10},
  ]);

  copyLink() {
    const link = 'https://t.me/YourBotUsername?start=12345';
    navigator.clipboard.writeText(link).then(
      () => alert('Referral link copied to clipboard!'),
      () => alert('Failed to copy referral link.')
    );
  }
}
