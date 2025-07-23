import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagerComponent } from './category-manager.component';
// import { ZooZoUIModule } from 'zoozo-ui'; // Uncomment if ZooZo UI module exists

@NgModule({
  declarations: [CategoryManagerComponent],
  imports: [CommonModule /*, ZooZoUIModule */],
  exports: [CategoryManagerComponent]
})
export class CategoryManagerModule {}
