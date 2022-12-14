import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CorrectionState, InputType, InteractiveVideoExercise, OptionsAnswer } from 'src/app/shared/types/types';
import anime from 'animejs';
import { ArgumentOutOfRangeError, timer } from 'rxjs';
import { FeedbackOxService, GameActionsService, SoundOxService } from 'micro-lesson-core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { CorrectablePart, isEven, PartCorrectness, PartFormat, ScreenTypeOx } from 'ox-types';
import { InteractiveVideoAnswerService } from 'src/app/shared/services/interactive-video-answer.service';
import { InteractiveVideoChallengeService } from 'src/app/shared/services/interactive-video-challenge.service';
import { ComposeAnimGenerator, ComposeService } from 'ox-animations';



@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent extends SubscriberOxDirective implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() exercise!:any;
  @Output() composeEmitter = new EventEmitter()
  @ViewChild('activityContainer') activityContainer!: ElementRef;
  @ViewChildren('checkBoxes') checkBoxes!:QueryList<ElementRef>;
  @ViewChildren('formControl') formControl!:QueryList<ElementRef>;

  private checkBoxesArray!:ElementRef[];
  private formControlArray!:ElementRef[];

  public composeReady!:boolean;
  public inputType!:InputType;
  public questionTextShow!:boolean;

  constructor(public gameActions: GameActionsService<any>, private answerService:InteractiveVideoAnswerService,
     public challengeService: InteractiveVideoChallengeService, private feedbackService:FeedbackOxService,
     private composeService: ComposeService<any>, private soundService: SoundOxService) { 
    super();
    this.composeReady = false;
    this.questionTextShow = false;
    this.addSubscription(this.gameActions.checkedAnswer, x => {  
    this.answerCorrection();
    })
    this.addSubscription(this.gameActions.surrender, surr => {
      this.surrender();
    })
  }
  
 
 

  ngOnInit(): void {
   this.setInputType();
  }


  ngAfterViewInit(): void {
  } 
  

  ngAfterViewChecked(): void {
  }


  
  public setInputType() :void {
    this.inputType = this.exercise.exercise.options.filter((e:any) => e.isAnswer).length > 1 ? 'checkbox' : 'radio';     
  }



  public answerCorrection():void {
   const values = this.checkedAndCorrectIndex();
   if(values.correct.every((b:any,i:any) => b === values.checked[i])) {
    this.playLoadedSound('mini-lessons/executive-functions/interactive-video/sounds/rightAnswer.mp3')
     this.challengeService.correctionState = true;
   } else {
    this.wrongAnimation()
   }
   this.feedbackService.endFeedback.emit()
  }
  


  private checkedAndCorrectIndex(): {correct:number[],checked:number[]} {
    return {
      correct:this.exercise.exercise.options.map((_b: any,i: any) => i).filter((i: any) => this.exercise.exercise.options[i].isAnswer),
      checked: this.checkBoxesArray.map((_b: any,i: any) => i).filter((i: any) => this.checkBoxesArray[i].nativeElement.checked)  
    }
  }



  private checkedAndCorrect() : {correct:OptionsAnswer[], checked:string[]} {
    return {
      correct: this.exercise.exercise.options.filter((b:any) => b.isAnswer),
      checked: this.checkBoxesArray.filter(b => b.nativeElement.checked).map(b => b.nativeElement.value)
    }
  }



  public questionInit():void{
   anime({
     targets:'.question',
     translateY:['15vh', '0vh'],
     opacity: [0,1],
     duration:350,
     easing:'linear',
     delay:1000,
     complete: () => {  
      this.checkBoxesArray = this.checkBoxes.toArray();
      this.formControlArray = this.formControl.toArray();

       timer(600).subscribe(x => {
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
      delay: anime.stagger(300),
    })
  }


  public rewindRestoreText():void {
    anime({
      targets:'.option-container',
      opacity: [1,0],
      duration:1
    })
    anime({
      targets:'.question',
      opacity: [1,0],
      duration:1,
    })
  }


  public correctablePart(): void {
    const values = this.checkedAndCorrect();
    const valuesIndex = this.checkedAndCorrectIndex();
    const correctablePart = (this.comparisson() ? values.correct : valuesIndex.checked).map((ans:any, i:any) => {
    const correctnessToReturn = (this.comparisson() ? valuesIndex.checked : values.correct).some(x => (this.comparisson() ? ans.id : ans) == (this.comparisson() ? x : (x as OptionsAnswer).id)) ? true : false;
      return {
        correctness: (correctnessToReturn ? 'correct' : 'wrong') as PartCorrectness,
        parts: [
          {
            format: 'word-text' as PartFormat,
            value: ans as string
          } 
        ]
      }
    })

    this.answerService.currentAnswer = {
      parts: correctablePart as CorrectablePart[],
      type:'parts'
    }
  }


  private comparisson(): boolean {
    const values = this.checkedAndCorrect();
    return (values.checked.length <= values.correct.length)
  }


  private wrongAnimation() {
    const checkedBoxes = this.checkBoxesArray.filter(b => b.nativeElement.checked);
    const checkBoxIndex = this.checkBoxes.map((c,i) => i).find(i => this.checkBoxesArray[i].nativeElement.checked) as number
    const rotate = Array.from(Array(8).keys()).map((z, i) => {
      return { value: isEven(i) ? 2 : -2, duration: 50 };
    }).concat([{ value: 0, duration: 50 }]);
    anime({
      begin: () => {
        this.playLoadedSound('mini-lessons/executive-functions/interactive-video/sounds/wrongAnswer.mp3')
      },
      targets: checkedBoxes.map(b => b.nativeElement),
      rotate
    });
    anime({
      targets: [checkedBoxes.map(b => b.nativeElement)],
      backgroundColor: 'rgb(255,0,0)',
      duration: 500,
      easing:'linear',
      direction: 'alternate'
    });
    anime({
      targets: this.formControlArray[checkBoxIndex].nativeElement,
      color: 'rgb(255,0,0)',
      duration: 500,
      easing:'linear',
      direction: 'alternate'
    });
  }
  
  
  public playLoadedSound(sound?: string) {
    if(sound)
    this.soundService.playSoundEffect(sound, ScreenTypeOx.Game);
  }



  surrender():void {
    this.playLoadedSound('mini-lessons/executive-functions/interactive-video/sounds/clickSurrender.mp3')
   const values = this.checkedAndCorrectIndex();
   this.checkBoxesArray.forEach(b => b.nativeElement.checked = false);
   values.correct.forEach(b => this.checkBoxesArray[b].nativeElement.checked = true);
   this.feedbackService.surrenderEnd.emit();
   this.challengeService.correctionState = true;
  }


}
