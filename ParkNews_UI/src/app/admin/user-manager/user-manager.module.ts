import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagerComponent } from './user-manager.component';
// import { ZooZoUIModule } from 'zoozo-ui'; // Uncomment if ZooZo UI module exists

@NgModule({
  declarations: [UserManagerComponent],
  imports: [CommonModule /*, ZooZoUIModule */],
  exports: [UserManagerComponent]
})
export class UserManagerModule {}
