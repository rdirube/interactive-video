import { EventEmitter, Injectable } from '@angular/core';
import { GoToTimeEvent, GoToVideoEvent, InteractionEvent } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoService {
 

 public goToVideo = new EventEmitter<GoToVideoEvent>();
  public goToTime = new EventEmitter<GoToTimeEvent>();


  constructor() { }


  triggerEvent(eventToTrigger: InteractionEvent) {
    switch (eventToTrigger.eventType) {
      case 'go-to-video': this.goToVideo.emit(eventToTrigger.eventData as GoToVideoEvent); break;
      case 'go-to-time': this.goToTime.emit(eventToTrigger.eventData as GoToTimeEvent); break;
    }
  }
}
