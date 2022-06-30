import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { interval, Subscription, timer } from 'rxjs';
import { InteractiveVideoService } from 'src/app/shared/services/interactive-video.service';
import { getYouTubeId, HHMMSStoNumberFromString, secondsToHHMMSS } from 'src/app/shared/types/functions';
import { vhToPx } from 'src/app/shared/types/functions';
import { Options } from '@angular-slider/ngx-slider';
import { InteractiveVideoExercise, QuestionResume } from 'src/app/shared/types/types';
import { ChallengeService, EndGameService, FeedbackOxService, GameActionsService, HintService, SoundOxService } from 'micro-lesson-core';
import { InteractiveVideoChallengeService } from 'src/app/shared/services/interactive-video-challenge.service';
import { ComposeAnimGenerator, ComposeService } from 'ox-animations';
import { ActivityComponent } from '../activity/activity.component';
import anime from 'animejs';
import { InteractiveVideoComposeService } from 'src/app/shared/services/interactive-video-compose.service';
import { duplicateWithJSON, ScreenTypeOx } from 'ox-types';



@Component({
  selector: 'app-interactive-video',
  templateUrl: './interactive-video.component.html',
  styleUrls: ['./interactive-video.component.scss']
})
export class InteractiveVideoComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  @ViewChild(YouTubePlayer) youtubePlayer!: YouTubePlayer;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('playPauseInput') playPauseInput!: ElementRef;
  @ViewChild('activityContainer') activityContainer!: ElementRef;
  @ViewChild(ActivityComponent) activityComponent!: ActivityComponent;
  @ViewChild('slider', { static: false }) slider!: ElementRef;



  @Input() exercise!: any;

  public player!: YT.Player;
  videoPlayerVars: YT.PlayerVars = {
    fs: 0,
    showinfo: 0,
    start: 0,
    autoplay: 0,
    controls: 0,
    rel: 0,
  };
  public videoWidth!: number;
  public videoHeight!: number;
  private timeInterval: Subscription | undefined;
  public currentTime!: number;
  public currentTimeToShow!: string;
  public durationToShow!: string;
  public videoId!: string;
  public videoPlay!: boolean;
  public isMute!: boolean;
  public soundImage!: string;
  private timeLeft!:number;
  public trimmedIndex!:number;
  public integratedVideoTime!:number;
  private timeOutVideo!:any;
  public pauseTime!:boolean;
  public accumulator!:number;
  public sliderWidth!:number; 
  public rewindActivated!:boolean;
  public correctAnswerCounter!:number;
  private alreadyMoved!:boolean;
  public positionAcc!:number; 
  public blockMovementButton!:boolean;

  public videoOptions: Options = {
    floor: 0,
    ceil: 0,
    hideLimitLabels: true,
    hidePointerLabels: true,

    translate: (value: number): string => {
      return secondsToHHMMSS(value);
    }
  };

  constructor(private interactiveVideo: InteractiveVideoService, public challengeService: InteractiveVideoChallengeService,
    private composeService: InteractiveVideoComposeService, public gameActions: GameActionsService<any>, private hintService:HintService
    ,private endGameService:EndGameService, private soundService: SoundOxService) {
    super();
    this.currentTime = 0;
    this.videoPlay = false;
    this.isMute = false;
    this.pauseTime = false;
    this.trimmedIndex = 0;
    this.integratedVideoTime = 0;
    this.rewindActivated = false;
    this.accumulator = 0;
    this.correctAnswerCounter = 0;
    this.alreadyMoved = false;
    this.positionAcc = 0; 
    this.blockMovementButton = false;
    this.soundImage = '../../../assets/interactive-video/svg/unmute.svg';
    this.addSubscription(this.composeService.continueVideo, x => {
      this.activityComponent.questionTextShow = false;
      this.exerciseCompose('0vh','-100vh', false)
    })
    this.addSubscription(this.gameActions.showHint, x => {
      this.playLoadedSound('mini-lessons/executive-functions/interactive-video/sounds/hint.mp3')
      this.challengeService.questionOn = false;
      this.rewindTime() 
      console.log(this.hintService)
    
    
           // this.rewindQuestionHide();
      // const rewindInSeconds = HHMMSStoNumberFromString(this.exercise.exercise.rewindAppearence);
      // this.videoSeek(rewindInSeconds);
      // this.integratedVideoTime -= (this.integratedVideoTime - rewindInSeconds)
    })
  }


  ngOnInit(): void {
    this.videoId = getYouTubeId(this.videoInfo.videoUrl)
    this.challengeService.questionOn = false;
    this.changeVideo(1, 0);
  }



  ngAfterViewInit(): void {
    this.videoHeight = document.body.clientHeight
    this.videoWidth = document.body.clientWidth;
    this.sliderWidth = this.slider.nativeElement.offsetWidth;
    this.setPosInVideo(this.challengeService.exerciseConfig.questionResume)
  }



  onReady($event: YT.PlayerEvent) {
    this.player = $event.target;
    this.setDuration();
    this.durationToShow = secondsToHHMMSS(this.videoInfo.finishesIn)
    this.currentTimeToShow = secondsToHHMMSS(0);
    this.timeLeft = this.videoInfo.finishesIn; 
  }



  setDuration() {
    this.videoOptions = { ...this.videoOptions, ceil: this.videoInfo.finishesIn}
    this.player.seekTo(this.videoInfo.trimmedPeriods[0].min,true);
    this.playPauseEvent(false)
  }



  private changeVideo(id: number, startIn?: number) {
    if (this.player) {
      this.integratedVideoTime = Math.round(this.integratedVideoTime);
      this.player?.loadVideoById({
        videoId: this.videoId,
        startSeconds: startIn
      });
    }
    if (!this.videoId) {
      throw new Error('You ask for a change to an unrecognized video with id ' + id);
    }
  }



  onStateChange($event: YT.OnStateChangeEvent) {
    switch ($event.data) {
      case YT.PlayerState.PLAYING:
        this.setTimeInterval();
        break;
      case YT.PlayerState.CUED:
        this.onCueChange($event);
        break;
      default:
        this.destroyTimeInterval();
        break;
    }
  }



  private setTimeInterval() {
    this.destroyTimeInterval();
    this.timeInterval = interval(500).subscribe(z => this.onTimeUpdated());
  }


  get videoInfo() {
    return this.challengeService.exerciseConfig.videoInfo;
  }

  public continueVideo() {
    timer(1000).subscribe(x => {
      this.playPauseEvent();
    })
  }

  private setPosInVideo(exercises: QuestionResume[]) {
    exercises.forEach(e => {
      const questionAppearence = e.appearenceByTrim.appearence + (e.appearenceByTrim.trim > 0 ? this.trimmedAccValue(e.appearenceByTrim.trim) : 0)
       const percetangeToMove = questionAppearence / this.videoInfo.finishesIn ;
       e.positionInVideo = (percetangeToMove * this.sliderWidth) - this.positionAcc;
       this.positionAcc += 2
    })
  }

  
  private trimmedAccValue(index: number): number {
    return this.challengeService.exerciseConfig.videoInfo.trimmedPeriods.filter((t, i) => i < index).map(t => t.max - t.min).reduce((acc, b) => acc + b)
  }


  public timerOn(state:boolean) {
    this.pauseInterval(state)
    clearInterval(this.timeOutVideo)  
    this.timeOutVideo = setInterval(()=> this.counterOn(), 1000);
   }
  
  
    public pauseInterval(state:boolean) {
      this.pauseTime = state;
    }
  
  
    private counterOn():void {
      if(!this.pauseTime) {
        this.integratedVideoTime++;
        this.currentTimeToShow = secondsToHHMMSS(this.integratedVideoTime);
      }
    }

  private destroyTimeInterval() {
    this.timeInterval?.unsubscribe();
    this.timeInterval = undefined;
  }


  public exerciseCompose(from:string, to:string, compose:boolean) {
    anime({
      begin:() => {
        this.playLoadedSound('mini-lessons/executive-functions/interactive-video/sounds/woosh.mp3')
      },
      targets: this.activityContainer.nativeElement,
      translateY: [from, to],
      duration:compose ? 1000 : 700,
      easing: !compose ?  'linear' : 'easeInOutSine' ,
      complete: () => {
        if(compose) {
          this.activityComponent.questionTextShow = true;
          this.activityComponent.composeReady = true;
          this.activityComponent.questionInit();
        } else {
          this.restoreActComponent();
          this.correctAnswerCounter++;
        }
      }
    })
  }


  private restoreActComponent():void {
   anime({
    targets: this.activityContainer.nativeElement,
    translateY: ['-100vh', '100vh'],
    duration:1,
    complete: () => {
      this.continueVideo();
      this.challengeService.questionOn = false;
      this.challengeService.correctionState = 'Not corrected';
      this.activityComponent.composeReady = false;
    }
   })
  }

  private maxMinDiffPerTrim(param:number):number {
    return this.videoInfo.trimmedPeriods[this.trimmedIndex + param].max - this.videoInfo.trimmedPeriods[this.trimmedIndex + param].min
  }


  public movementCondition(foward:boolean , directionMovement:number):void {
    if(this.integratedVideoTime >  0 && !this.blockMovementButton) {
      if(foward ? this.currentTime + directionMovement > this.videoInfo.trimmedPeriods[this.trimmedIndex].max : this.currentTime - directionMovement < this.videoInfo.trimmedPeriods[this.trimmedIndex].min) {
        const firstTime = duplicateWithJSON(this.currentTime);
        if(!foward) {
          this.accumulator -= this.maxMinDiffPerTrim(-1)
        } else {
          this.alreadyMoved = true;
          this.accumulator += this.maxMinDiffPerTrim(1)
        }
        foward ? this.trimmedIndex++ : this.trimmedIndex--;
        timer(50).subscribe(x => {
         const conditionalChange = foward ? this.videoInfo.trimmedPeriods[this.trimmedIndex].min + (directionMovement - (this.videoInfo.trimmedPeriods[this.trimmedIndex - 1].max - firstTime)) : this.videoInfo.trimmedPeriods[this.trimmedIndex].max - ((directionMovement) - (firstTime - this.videoInfo.trimmedPeriods[this.trimmedIndex + 1].min))
         this.videoTranslation(foward, directionMovement, conditionalChange)
        })
       } else {
        this.videoTranslation(foward, directionMovement, this.currentTime + (foward ? directionMovement : -directionMovement))
      }
      this.blockMovementButton = true;
      this.nullMovementButton();
    } else {
      this.playLoadedSound('mini-lessons/executive-functions/interactive-video/sounds/cantClick.mp3')

    }
 }
 


 private nullMovementButton():void {
   setTimeout(() => {
    this.blockMovementButton = false;
   }, 1000)
 }


  private rewindQuestionHide():void {
    anime({
      targets: this.activityContainer.nativeElement,
      translateY: ['0vh', '100vh'],
      duration:1,
      complete: () => {
        this.activityComponent.rewindRestoreText();
        this.activityComponent.composeReady = false;
        this.rewindActivated = true;

      }
    })
  }


  public videoTranslation(foward: boolean, movementSet:number, seekTo:number) {
    this.player.seekTo(seekTo, true)
    const movement = (foward ? movementSet : -movementSet);
    this.integratedVideoTime += movement;
    this.currentTimeToShow = secondsToHHMMSS(this.integratedVideoTime)
  }



  onCueChange($event: YT.OnStateChangeEvent) {
    this.player.seekTo(10,true)
    this.youtubePlayer.playVideo();
    this.setDuration()
  }


  public videoSeek(value:number) {
    this.youtubePlayer.seekTo(value, true);
    this.playPauseEvent(false); 
  }


  public playPauseEvent(state?:boolean, e?: MouseEvent) {
    this.videoPlay = state !== undefined ? state : !this.videoPlay ;
    this.timerOn(!this.videoPlay);
    this.videoPlay ? this.player.playVideo() : this.player.pauseVideo();
    if(this.playPauseInput) {
      this.playPauseInput.nativeElement.checked = !this.videoPlay;
    }
    if (e) {
      e?.stopPropagation()
      e?.preventDefault()
    }
  }

  private playLoadedSound(sound?: string) {
    if(sound)
    this.soundService.playSoundEffect(sound, ScreenTypeOx.Game);
  }




  private onTimeUpdated() {
    const appearenceInSeconds = HHMMSStoNumberFromString(this.exercise.exercise.appearence);
    const duration = this.videoInfo.finishesIn;
    this.currentTime = Math.floor(this.player.getCurrentTime()) 
    const conditionToNextTrimm = this.maxMinDiffPerTrim(0) + this.accumulator;
    if (appearenceInSeconds <= this.integratedVideoTime && !this.challengeService.exercisesAreOver) {
      this.rewindActivated = false;
      this.playPauseEvent(false);
      this.exerciseCompose('100vh', '0vh', true);
      this.challengeService.questionOn = true;
      timer(50).subscribe(x => {
        this.activityComponent.setInputType();
      }) 
    } 
    if(this.integratedVideoTime >= duration) {
      this.challengeService.finishedTime = true;
      this.gameActions.microLessonCompleted.emit();
      this.playPauseEvent(false)
    }
    if(conditionToNextTrimm <= this.integratedVideoTime && this.challengeService.exerciseConfig.questionResume.length > this.trimmedIndex) {
      this.accumulator += this.maxMinDiffPerTrim(0);
      if(!this.alreadyMoved) {
        this.trimmedIndex++;
        this.player.seekTo(this.videoInfo.trimmedPeriods[this.trimmedIndex].min, true)
      } else {
        this.alreadyMoved = false
      }
    }
    
  
  }



  public soundOnOff() {
    if (this.isMute) {
      this.youtubePlayer.unMute();
      this.soundImage = '../../../assets/interactive-video/svg/unmute.svg';
    } else {
      this.youtubePlayer.mute();
      this.soundImage = '../../../assets/interactive-video/svg/mute.svg';
    }
    this.isMute = !this.isMute;
  }



  public rewindTime() {
    const diffTime = this.exercise.exercise.rewindByTrim.trim > 0 ? this.videoInfo.trimmedPeriods.filter((d,i) => i < this.exercise.exercise.rewindByTrim.trim).map(d => d.max - d.min).reduce((acc,b) => acc + b) : this.videoInfo.trimmedPeriods[0].min
    const rewindTime = this.exercise.exercise.rewindByTrim.appearence + diffTime;
    const findTrim = this.videoInfo.trimmedPeriods.findIndex(t => t.max > rewindTime && t.min <= rewindTime);
    const timeToRewind = findTrim > 0 ? this.videoInfo.trimmedPeriods.filter((t,i) => i < findTrim).map(t => t.max - t.min).reduce((acc,b) => acc + b) : 0 
    this.accumulatorRewindCalculator(findTrim);
    this.integratedVideoTime =  this.exercise.exercise.rewindByTrim.appearence + timeToRewind;
    this.player.seekTo(rewindTime, true);
    this.rewindQuestionHide();
    this.youtubePlayer.pauseVideo();
  }

  
  private accumulatorRewindCalculator(rewindTrim:number) {
     const actualTrim = this.videoInfo.trimmedPeriods.findIndex(t => t.max > this.currentTime && t.min <= this.currentTime);
     if(rewindTrim < actualTrim) {
      const TrimDiff = actualTrim - rewindTrim;
      for(let i = 0; TrimDiff > i ; i++) {
        this.accumulator-= this.maxMinDiffPerTrim(-1)
        this.trimmedIndex--;
      }
     }
    }
  

}
