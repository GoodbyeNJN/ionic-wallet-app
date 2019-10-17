import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Erc20Page } from './erc20';

@NgModule({
  declarations: [
    Erc20Page,
  ],
  imports: [
    IonicPageModule.forChild(Erc20Page),
  ],
})
export class Erc20PageModule {}
