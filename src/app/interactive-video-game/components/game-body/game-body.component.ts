import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { ExerciseOx } from 'ox-core';
import { InteractiveVideoChallengeService } from 'src/app/shared/services/interactive-video-challenge.service';
import { InteractiveVideoExercise, InteractiveVideoNivelation } from 'src/app/shared/types/types';
import { filter, take, timer } from 'rxjs';
import { InteractiveVideoComponent } from '../interactive-video/interactive-video.component';
import { InteractiveVideoComposeService } from 'src/app/shared/services/interactive-video-compose.service';
import { EndGameService, GameActionsService, HintService, MicroLessonMetricsService } from 'micro-lesson-core';
import { ExerciseData, MultipleChoiceSchemaData } from 'ox-types';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit {
  

  public exercise!: any;
  public questionOn!:boolean;
  @ViewChild(InteractiveVideoComponent) interactiveVideo! :InteractiveVideoComponent;

  constructor(public challengeService: InteractiveVideoChallengeService, public composeService:InteractiveVideoComposeService,
     private hintService:HintService, private metricsService: MicroLessonMetricsService<any>, public gameActions: GameActionsService<any>, private endGameService:EndGameService) { 
    super()
    this.questionOn = false;
    this.endGameService.sendEndEvent = false;
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
    (exercise: ExerciseOx<InteractiveVideoExercise>) => {
      this.addMetric()
      const exerciseIndex = this.metricsService.currentMetrics.expandableInfo?.exercisesData.length as number;
      this.exercise = exercise.exerciseData;
      console.log(exerciseIndex)
      if(exerciseIndex === 1 && this.interactiveVideo !== undefined) {
      this.interactiveVideo.videoSeek(0);
      this.challengeService.exercisesAreOver = false;
      }
      this.hintService.usesPerChallenge = 1;
      this.composeService.continueVideo.emit();
    });
  }

  ngOnInit(): void {
  }

  
  private addMetric(): void {
    const myMetric: ExerciseData = {
      schemaType: 'multiple-choice',
      schemaData: {

      } as MultipleChoiceSchemaData,
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answer',
      maxHints: 1,
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: undefined as any,
      firstInteractionTime: undefined as any
    };
    this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
      myMetric.firstInteractionTime = new Date();
    });
    this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
      z => {
        myMetric.finishTime = new Date();
        console.log('Finish time');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
  }



}
