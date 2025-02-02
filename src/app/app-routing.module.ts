import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FriendsComponent } from './friends/friends.component';
import { MineComponent } from './mine/mine.component';
import { TaskComponent } from './task/task.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { WalletComponent } from './wallet/wallet.component';
import { AdminLoginPageComponent } from './admin-login-page/admin-login-page.component';
import { WalletMainPageComponent } from './wallet-main-page/wallet-main-page.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: 'mine', component: MineComponent },
  { path: 'task', component: TaskComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'about', component: AboutComponent },
  { path: 'wallet-main-page', component: WalletMainPageComponent },
  { path: 'admin-login-page', component: AdminLoginPageComponent },
  { path: 'setting', component: SettingComponent },
  {
    path: 'admin-portal',
    loadChildren: () => import('./admin-portal/admin-portal.module').then((ON) => ON.AdminPortalModule)
  },
  { path: '', redirectTo: '/mine', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
