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
  public finishedTime:boolean = false; 

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
      console.log(this.exerciseIndex, this.exercisesAreOver)
      this.exercisesAreOver = true;
      this.exerciseIndex =  this.exerciseConfig.questionResume.length - 1;
    } else if(this.exerciseIndex === 0 && this.finishedTime) {
      this.exercisesAreOver = false;
      this.finishedTime = false;
    }
    return new ExerciseOx (
      {
        exercise: this.exerciseConfig.questionResume[this.exerciseIndex]
      } , 1 ,{maxTimeToBonus:0, freeTime:0}, []
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
        this.exerciseConfig = this.getExerciseConfig();;
        console.log(this.exerciseConfig);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }  
  }


  public getExerciseConfig(): any {
    return this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo;
  }


}
