import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPortalComponent } from './admin-portal.component';
import { UserDetailsComponent } from './user-details/user-details.component';
// import { TaskComponent } from '../task/task.component';
import { TonConnectedUserComponent } from './ton-connected-user/ton-connected-user.component';
import { TaskAdminComponent } from './task-admin/task-admin.component';

const routes: Routes = [
  {
     path:'', component: AdminPortalComponent,
     children: [
      {path:'user-details', component: UserDetailsComponent},
      {
        path: 'task-admin', component: TaskAdminComponent
      },
      {
        path: 'ton-connected-user', component: TonConnectedUserComponent
      },
      {
        path: '', redirectTo: '/admin-portal/user-details', pathMatch: 'full'
      }
     ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPortalRoutingModule { }
