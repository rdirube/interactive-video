import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AppInfoOxService, BaseMicroLessonApp, EndGameService, GameActionsService, InWumboxService, LevelService, MicroLessonCommunicationService, MicroLessonMetricsService, ProgressService, ResourceStateService, SoundOxService } from 'micro-lesson-core';
import { PostMessageBridgeFactory } from 'ngox-post-message';
import { CommunicationOxService, I18nService, PreloaderOxService, ResourceOx, ResourceType } from 'ox-core';
import { ResourceFinalStateOxBridge, ScreenTypeOx } from 'ox-types';
import { environment } from 'src/environments/environment';
import { InteractiveVideoChallengeService } from './shared/services/interactive-video-challenge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseMicroLessonApp {

  constructor(preloader: PreloaderOxService, translocoService: TranslocoService, wumboxService: InWumboxService,
    communicationOxService: CommunicationOxService, microLessonCommunicationService: MicroLessonCommunicationService<any>,
    progressService: ProgressService, elementRef: ElementRef, private _gameActionsService: GameActionsService<any>,
    endGame: EndGameService, i18nService: I18nService, levelService: LevelService, http: HttpClient,
    private _challengeService: InteractiveVideoChallengeService, private _appInfoService: AppInfoOxService,
    private _metrics: MicroLessonMetricsService<any>, // Todo
    resourceStateService: ResourceStateService,
    sound: SoundOxService, bridgeFactory: PostMessageBridgeFactory,
   ) {
    super(preloader, translocoService, wumboxService, communicationOxService, microLessonCommunicationService,
      progressService, elementRef, _gameActionsService, endGame,
      i18nService, levelService, http, _challengeService, _appInfoService, _metrics, sound, bridgeFactory);

    communicationOxService.receiveI18NInfo.subscribe(z => {
      console.log('i18n', z);
    });
    this._gameActionsService.microLessonCompleted.subscribe(__ => {
      if (resourceStateService.currentState?.value) {
        microLessonCommunicationService.sendMessageMLToManager(ResourceFinalStateOxBridge, resourceStateService.currentState.value);
      }
    });

    // preloader.addResourcesToLoad(this.getGameResourcesToLoad());
    console.log('App component instanciated', this);
    this.sound.setSoundOn(true);  
   preloader.loadAll().subscribe(x => this.loaded = true)
  }



  protected getBasePath(): string {
  return environment.basePath;
   }


  protected getGameResourcesToLoad(): ResourceOx[] {
    const svg:string[] = ['mute.svg', 'unmute.svg'];
    const svgElementos: string[] = ['check.svg', 'copa-memotest.svg', 'next-memotest.svg', 'surrender.svg', 'menu.svg', 'pista.svg', 'sonido-activado.svg'];

    return svg.map(x => new ResourceOx('interactive-video/svg/' + x, ResourceType.Svg,
    [ScreenTypeOx.Game], true)).concat(svgElementos.map(x => new ResourceOx('mini-lessons/executive-functions/interactive-video/buttons/' + x, ResourceType.Svg,
    [ScreenTypeOx.Game], true)))
  }
  title = 'interactive-video';
}
