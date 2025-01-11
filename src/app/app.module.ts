import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BottomNavbarComponent } from './bottom-navbar/bottom-navbar.component';
import { MineComponent } from './mine/mine.component';
import { TaskComponent } from './task/task.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { FriendsComponent } from './friends/friends.component';
import { WalletComponent } from './wallet/wallet.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    BottomNavbarComponent,
    MineComponent,
    TaskComponent,
    UpgradeComponent,
    FriendsComponent,
    WalletComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatBottomSheetModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
