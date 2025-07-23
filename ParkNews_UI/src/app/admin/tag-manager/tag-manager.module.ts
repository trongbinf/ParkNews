import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagManagerComponent } from './tag-manager.component';
// import { ZooZoUIModule } from 'zoozo-ui'; // Uncomment if ZooZo UI module exists

@NgModule({
  declarations: [TagManagerComponent],
  imports: [CommonModule /*, ZooZoUIModule */],
  exports: [TagManagerComponent]
})
export class TagManagerModule {}
