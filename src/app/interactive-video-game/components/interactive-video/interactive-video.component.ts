import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { timer } from 'rxjs';
import { getYouTubeId } from 'src/app/shared/types/functions';


@Component({
  selector: 'app-interactive-video',
  templateUrl: './interactive-video.component.html',
  styleUrls: ['./interactive-video.component.scss']
})
export class InteractiveVideoComponent implements OnInit, AfterViewInit {

  @ViewChild(YouTubePlayer) youtubePlayer!: YouTubePlayer;

  public player!: YT.Player;
  videoPlayerVars: YT.PlayerVars = {
    fs: 0,
    showinfo: 0,
    start: 4,
    autoplay: 0,
    controls:0,
    rel: 0,
  };


  public videoId!:string;


  constructor() { 
    this.videoId = getYouTubeId('//www.youtube.com/v/qUJYqhKZrwA?autoplay=1&showinfo=0&controls=0')
    console.log(this.videoId)
  }
 

  ngOnInit(): void {
  
  }


  ngAfterViewInit(): void {
   console.log(this.youtubePlayer)

  }

  onReady($event: YT.PlayerEvent) {
    this.player = $event.target; 
      this.player?.loadVideoById({
        videoId: this.videoId,
        startSeconds: 10
    })
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
