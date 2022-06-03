import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { InterectiveVideoGameModule } from './interactive-video-game/interective-video-game.module';
import { AnswerService, ChallengeService } from 'micro-lesson-core';
import { InteractiveVideoChallengeService } from './shared/services/interactive-video-challenge.service';
import { InteractiveVideoAnswerService } from './shared/services/interactive-video-answer.service';
import { TranslocoModule } from '@ngneat/transloco';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    InterectiveVideoGameModule,
    HttpClientModule,
    TranslocoModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: ChallengeService,
      useExisting: InteractiveVideoChallengeService
    },
    {
      provide: AnswerService,
      useExisting: InteractiveVideoAnswerService
    },
   ],
   
  bootstrap: [AppComponent]
})
export class AppModule { }
