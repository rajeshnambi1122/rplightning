import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FriendsComponent } from './friends/friends.component';
import { MineComponent } from './mine/mine.component';
import { TaskComponent } from './task/task.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  { path: 'mine', component: MineComponent },
  { path: 'task', component: TaskComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/mine', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
