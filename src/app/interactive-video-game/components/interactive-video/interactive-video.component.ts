import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { timer } from 'rxjs';
import { InteractiveVideoService } from 'src/app/shared/services/interactive-video.service';
import { getYouTubeId } from 'src/app/shared/types/functions';
import { vhToPx } from 'src/app/shared/types/functions';

@Component({
  selector: 'app-interactive-video',
  templateUrl: './interactive-video.component.html',
  styleUrls: ['./interactive-video.component.scss']
})
export class InteractiveVideoComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  @ViewChild(YouTubePlayer) youtubePlayer!: YouTubePlayer;
  @ViewChild('videoContainer') videoContainer!: ElementRef;

  public player!: YT.Player;
  videoPlayerVars: YT.PlayerVars = {
    fs: 0,
    showinfo: 0,
    start: 4,
    autoplay: 0,
    controls:0,
    rel: 0,
  };
  public videoWidth!:number;
  public videoHeight!:number;
  public questionOn!:boolean;


  public videoId!:string;


  constructor(private interactiveVideo:InteractiveVideoService) { 
    super();
   
  }
 

  ngOnInit(): void {
    this.questionOn = false;
    this.videoId = getYouTubeId('//www.youtube.com/v/qUJYqhKZrwA?autoplay=1&showinfo=0&controls=0')
    this.changeVideo(1, 0)

  }


  ngAfterViewInit(): void {
    console.log(this.videoContainer)
    this.videoHeight = document.body.clientHeight
    this.videoWidth = document.body.clientWidth;
  }

  onReady($event: YT.PlayerEvent) {
    this.player = $event.target; 
    //   this.player?.loadVideoById({
    //     videoId: this.videoId,
    //     startSeconds: 10
    // })
  }


  private changeVideo(id: number, startIn?: number) {
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
        break;
      case YT.PlayerState.CUED:
        this.onCueChange($event);
        break;
      default:
        break;
    }
  }


  onCueChange($event: YT.OnStateChangeEvent) {
    this.youtubePlayer.seekTo(10, true);
    this.youtubePlayer.playVideo();
  }
  // onStateChange($event: YT.OnStateChangeEvent) {
  //   switch ($event.data) {
  //     case YT.PlayerState.PLAYING:
  //       this.setTimeInterval();
  //       break;
  //     case YT.PlayerState.CUED:
  //       this.onCueChange($event);
  //       break;
  //     default:
  //       this.destroyTimeInterval();
  //       break;
  //   }
  // }


}
