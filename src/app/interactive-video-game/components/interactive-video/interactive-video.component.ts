import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { interval, Subscription, timer } from 'rxjs';
import { InteractiveVideoService } from 'src/app/shared/services/interactive-video.service';
import { getYouTubeId, secondsToHHMMSS } from 'src/app/shared/types/functions';
import { vhToPx } from 'src/app/shared/types/functions';
import { Options } from '@angular-slider/ngx-slider';



@Component({
  selector: 'app-interactive-video',
  templateUrl: './interactive-video.component.html',
  styleUrls: ['./interactive-video.component.scss']
})
export class InteractiveVideoComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  @ViewChild(YouTubePlayer) youtubePlayer!: YouTubePlayer;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  @ViewChild('playPauseInput') playPauseInput!:ElementRef;

  public player!: YT.Player;
  videoPlayerVars: YT.PlayerVars = {
    fs: 0,
    showinfo: 0,
    start: 2,
    autoplay: 0,
    controls:0,
    rel: 0,
  };
  public videoWidth!:number;
  public videoHeight!:number;
  public questionOn!:boolean;
  private timeInterval: Subscription | undefined;
  public currentTime!:number;
  public currentTimeToShow!:string;
  public durationToShow!:string;
  public videoId!:string;
  public videoPlay!: boolean;
  public isMute!:boolean;
  public soundImage!:string;

  public videoOptions: Options = {
    floor: 0,
    ceil: 0,
    hideLimitLabels:true,
    hidePointerLabels:true,

    translate: (value: number): string => {
      return secondsToHHMMSS(value);
    }
  };

  constructor(private interactiveVideo:InteractiveVideoService) { 
    super();
    this.currentTime = 0;
    this.questionOn = false;
    this.videoPlay = false;
    this.isMute = false;
    this.soundImage = '../../../assets/interactive-video/svg/mute.svg'
  }
 

  ngOnInit(): void {
    this.questionOn = false;
    this.videoId = getYouTubeId('//www.youtube.com/v/qUJYqhKZrwA?autoplay=1&showinfo=0&controls=0')
    this.changeVideo(1, 0)
  }


  ngAfterViewInit(): void {
    this.videoHeight = document.body.clientHeight
    this.videoWidth = document.body.clientWidth;
  }

  onReady($event: YT.PlayerEvent) {
    this.player = $event.target;
    this.setDuration();
    this.durationToShow = secondsToHHMMSS(this.player.getDuration())
    this.currentTimeToShow = secondsToHHMMSS(0)
  }
  
  
  setDuration() {
    this.videoOptions ={ ...this.videoOptions, ceil: this.player.getDuration() } ; 
  }


  private changeVideo(id: number, startIn?: number) {
    this.videoOptions.ceil = this.player.getDuration(); 
    this.currentTime = Math.round(this.player.getCurrentTime());
    this.player?.loadVideoById({
      videoId: this.videoId,
      startSeconds: startIn
    });
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
    this.timeInterval = interval(1000).subscribe(z => this.onTimeUpdated());
  }



  private destroyTimeInterval() {
    this.timeInterval?.unsubscribe();
    this.timeInterval = undefined;
  }


  public videoTranslation(foward:boolean) {
  this.youtubePlayer.seekTo(this.currentTime + (foward ? 3 : -3), true) 
  }



  onCueChange($event: YT.OnStateChangeEvent) {
    this.youtubePlayer.seekTo(10, true);
    this.youtubePlayer.playVideo();
    this.setDuration()

  }

  public playPauseEvent(isButton:boolean, e:MouseEvent) {
    this.videoPlay = !this.videoPlay;
    this.videoPlay ? this.player.playVideo() : this.player.pauseVideo();
    this.playPauseInput.nativeElement.checked = !this.videoPlay;
     e.stopPropagation()
    e.preventDefault()
    
  }

  private onTimeUpdated() {
    this.currentTime = Math.round(this.player.getCurrentTime());
    this.currentTimeToShow = secondsToHHMMSS(this.currentTime);
  }


  public soundOnOff() {
  if(this.isMute){
    this.youtubePlayer.mute();
    this.soundImage = '../../../assets/interactive-video/svg/mute.svg';
  } else {
    this.youtubePlayer.unMute();
    this.soundImage = '../../../assets/interactive-video/svg/unmute.svg';
  }
  this.isMute = !this.isMute;
  } 
  


}
