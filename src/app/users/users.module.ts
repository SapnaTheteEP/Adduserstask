import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from '../users/users.component';
import { AddUpdateUsersComponent } from './add-update-users/add-update-users.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    UsersComponent,
    AddUpdateUsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule

  ]
})
export class UsersModule { }
