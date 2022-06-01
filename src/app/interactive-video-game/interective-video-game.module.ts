import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GameBodyComponent } from './components/game-body/game-body.component';
import { InteractiveVideoComponent } from './components/interactive-video/interactive-video.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { ActivityComponent } from './components/activity/activity.component';


@NgModule({
  declarations: [
    GameBodyComponent,
    InteractiveVideoComponent,
    ActivityComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    YouTubePlayerModule
  ],
  exports: [
    GameBodyComponent,
    YouTubePlayerModule
  ]
})
export class InterectiveVideoGameModule { }
