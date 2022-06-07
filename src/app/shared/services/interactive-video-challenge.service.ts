import { EventEmitter, Injectable } from '@angular/core';
import { AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService } from 'micro-lesson-core';
import { ExerciseOx, PreloaderOxService } from 'ox-core';
import { ExpandableInfo } from 'ox-types';
import { CorrectionState, InteractiveVideoExercise, InteractiveVideoNivelation } from '../types/types';



@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoChallengeService extends ChallengeService<InteractiveVideoExercise,any> {


 public questionOn:boolean = false;
 public correctionState:CorrectionState =  'Not corrected';
 public exercisesAreOver:boolean = false;

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
    this.exerciseIndex = 0;

  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<InteractiveVideoExercise> {
    if(this.exerciseIndex > this.exerciseConfig.questionResume.length - 1) {
       this.exerciseIndex = this.exerciseConfig.questionResume.length - 1;
       this.exercisesAreOver = true;
    } 
    return new ExerciseOx (
      {
        exercise: this.exerciseConfig.questionResume[this.exerciseIndex]
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
        this.exerciseConfig = JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"interactive-video-creator","type":"challenges","screenTheme":"executive-functions","exerciseCount":1,"microLessonGameInfo":{"questionResume":[{"id":0,"question":"Selecciona los numeros mayores a 4 y menores a 8, que cumplan con el requisito de ser multiplos de 2.","options":[{"id":"0","content":"1","isAnswer":true},{"id":"1","content":"2","isAnswer":false},{"id":"2","content":"3","isAnswer":true},{"id":"3","content":"4","isAnswer":true}],"type":"select","uniqueAnswer":null,"positionInVideo":null,"corrected":false,"appearence":"00:05","rewindAppearence":"00:03"}, {"id":0,"question":"Selecciona los numeros mayores a 4 y menores a 8.","options":[{"id":"0","content":"5","isAnswer":false},{"id":"1","content":"6","isAnswer":true},{"id":"2","content":"7","isAnswer":false},{"id":"3","content":"8","isAnswer":false}],"type":"select","uniqueAnswer":null,"positionInVideo":null,"corrected":false,"appearence":"00:12","rewindAppearence":"00:05"} ],"videoInfo":{"videoUrl":"//www.youtube.com/watch?v=6EM9qrXRJhk&ab_channel=JacquiSive","isVideo":true,"startsIn":47,"finishesIn":158,"alias":"Pepe"}},"extraInfo":{"gameUrl":"https://text-structure.web.app","theme":"volcano","exerciseCase":"created","language":"ESP"}},"format":"interactive-video-creator","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"interactive-video-creator","url":"https://ml-screen-manager.firebaseapp.com"}}}').properties.customConfig.creatorInfo?.microLessonGameInfo;
        console.log(this.exerciseConfig);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }  
  }



}
