import { EventEmitter, Injectable } from '@angular/core';
import { AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService } from 'micro-lesson-core';
import { ExerciseOx, PreloaderOxService } from 'ox-core';
import { ExpandableInfo } from 'ox-types';
import { InteractiveVideoNivelation } from '../types/types';



@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoChallengeService extends ChallengeService<any,any> {
  protected generateNextChallenge(subLevel: number): ExerciseOx<any> {
    throw new Error('Method not implemented.');
  }
  protected equalsExerciseData(exerciseData: any, exerciseDoneData: any): boolean {
    throw new Error('Method not implemented.');
  }
  getMetricsInitialExpandableInfo(): ExpandableInfo {
    throw new Error('Method not implemented.');
  }

  public exerciseConfig!: InteractiveVideoNivelation;


  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
    subLevelService: SubLevelService,
    private preloaderService: PreloaderOxService,
    private feedback: FeedbackOxService,
    private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
  }



  beforeStartGame(): void  {
    const gameCase = 'created-config';
    console.log('this', this);
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        // this.exerciseConfig = this.getExerciseConfig();
        console.log(this.exerciseConfig);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }  
  }

}
