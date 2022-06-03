import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { CorrectionState, InteractiveVideoExercise } from 'src/app/shared/types/types';
import anime from 'animejs';
import { timer } from 'rxjs';
import { GameActionsService } from 'micro-lesson-core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { CorrectablePart, PartCorrectness, PartFormat } from 'ox-types';
import { InteractiveVideoAnswerService } from 'src/app/shared/services/interactive-video-answer.service';
import { InteractiveVideoChallengeService } from 'src/app/shared/services/interactive-video-challenge.service';



@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent extends SubscriberOxDirective implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() exercise!:any;
  @Output() continueVideo = new EventEmitter()
  @ViewChildren('checkBoxes') checkBoxes!:QueryList<ElementRef>;
  private checkBoxesArray!:ElementRef[];
  public correctionState:CorrectionState =  'Not corrected';

  constructor(public gameActions: GameActionsService<any>, private answerService:InteractiveVideoAnswerService, public challengeService: InteractiveVideoChallengeService) { 
    super();
    this.addSubscription(this.gameActions.checkedAnswer, x => {  
    this.answerCorrection();
    })
  }
 
 

  ngOnInit(): void {
    console.log(this.exercise.exercise.type)
    
  }

  ngAfterViewInit(): void {
    this.questionInit();
    this.checkBoxesArray = this.checkBoxes.toArray();

  } 

  ngAfterViewChecked(): void {
  }



  public answerCorrection():void {
   const values = this.checkedAndCorrectIndex();
   if(values.correct.every((b:any,i:any) => b === values.checked[i])) {
     this.challengeService.questionOn = false;
     this.continueVideo.emit();
     this.correctionState = true;
   } else {
    this.correctionState = false;

     console.log('wrong!')
   }
  }
  

  private checkedAndCorrectIndex(): {correct:number[],checked:number[]} {
    return {
      correct:this.exercise.exercise.options.map((_b: any,i: any) => i).filter((i: any) => this.exercise.exercise.options[i].isAnswer),
      checked: this.checkBoxesArray.map((_b: any,i: any) => i).filter((i: any) => this.checkBoxesArray[i].nativeElement.checked)  
    }
  }



  private questionInit():void{
   anime({
     targets:'.question',
     translateY:['15vh', '0vh'],
     opacity: [0,1],
     duration:350,
     easing:'linear',
     delay:1000,
     complete: () => {  
       timer(200).subscribe(x => {
        this.optionsInit()          
       })
     }
    })
  }


  private optionsInit():void {
    anime({
      targets: '.option-container',
      translateY:['15vh', '0vh'],
      opacity: [0,1],
      delay: anime.stagger(500),
    })
  }



  public correctablePart(): void {
    const values = this.checkedAndCorrectIndex();
    const correctablePart = values.correct.map((ans:any, i:any) => {
      const correctnessToReturn = values.checked.some(x => x === ans) ? true : false;
      return {
        correctness: (correctnessToReturn ? 'correct' : 'wrong') as PartCorrectness,
        parts: [
          {
            format: 'word-text' as PartFormat,
            value: ans.data as string
          }
        ]
      }
    })
    this.answerService.currentAnswer = {
      parts: correctablePart as CorrectablePart[],
      type:'parts'
    }
  }
  


}
