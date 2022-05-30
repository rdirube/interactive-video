export type InteractionEventType = 'go-to-video' | 'go-to-time' | 'continue' | 'open-interaction' | 'play-sound' | 'none';
export type   InteractionEventDataType = GoToVideoEvent | GoToTimeEvent  | {};


export interface UserVideoFields {
    startsIn: number;
    finishesIn:number;
    videoUrl: string;
    alias: string;
    isVideo:boolean
  }



  export interface UserVideoFields {
    startsIn: number;
    finishesIn:number;
    videoUrl: string;
    alias: string;
    isVideo:boolean
  }

  export interface InteractionEventData {
    timestamp?: number;
    // fromInteractionId: number;
  }

  export interface GoToVideoEvent extends InteractionEventData {
    videoId: number;
    startsIn?: number;
  }
  
  export interface GoToTimeEvent extends InteractionEventData {
    toTime: number;
  }
  

  export interface InteractionEvent {
    eventType: InteractionEventType;
    eventData: InteractionEventDataType;
  }
  