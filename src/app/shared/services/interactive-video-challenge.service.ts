import { EventEmitter, Injectable } from '@angular/core';
import { AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService } from 'micro-lesson-core';
import { ExerciseOx, PreloaderOxService } from 'ox-core';
import { ExpandableInfo } from 'ox-types';
import { InteractiveVideoExercise, InteractiveVideoNivelation } from '../types/types';



@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoChallengeService extends ChallengeService<any,any> {


 public currentIndex:number = 0;
 public questionOn:boolean = false;

  getMetricsInitialExpandableInfo(): ExpandableInfo {
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: 'infinite',
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'total',
      },
    }; 
   }

  public exerciseConfig!: InteractiveVideoNivelation;


  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
    subLevelService: SubLevelService,
    private preloaderService: PreloaderOxService,
    private feedback: FeedbackOxService,
    private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<InteractiveVideoExercise> {
    return new ExerciseOx (
      {
        exercise: this.exerciseConfig.questionResume[this.currentIndex]
      }, 1 ,{maxTimeToBonus:0, freeTime:0}, []
    )
  }
  protected equalsExerciseData(exerciseData: any, exerciseDoneData: any): boolean {
    return true
      }


  beforeStartGame(): void  {
    const gameCase = 'created-config';
    console.log('this', this);
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        this.exerciseConfig = JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"interactive-video-creator","type":"challenges","screenTheme":"executive-functions","exerciseCount":1,"microLessonGameInfo":{"questionResume":[{"id":0,"question":"Selecciona los numeros mayores a 4 y menores a 8.","options":[{"content":"1","isAnswer":true},{"content":"2","isAnswer":false},{"content":"3","isAnswer":true},{"content":"4","isAnswer":true}],"type":"select","uniqueAnswer":null,"positionInVideo":null,"corrected":false,"appearence":"00:05","rewindAppearence":"00:03"}],"videoInfo":{"videoUrl":"//www.youtube.com/v/qUJYqhKZrwA?autoplay=1&showinfo=0&controls=0","isVideo":true,"startsIn":47,"finishesIn":158,"alias":"Pepe"}},"extraInfo":{"gameUrl":"https://text-structure.web.app","theme":"volcano","exerciseCase":"created","language":"ESP"}},"format":"interactive-video-creator","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"interactive-video-creator","url":"https://ml-screen-manager.firebaseapp.com"}}}').properties.customConfig.creatorInfo?.microLessonGameInfo;
        console.log(this.exerciseConfig);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }  
  }

}
