export type InteractionEventType = 'go-to-video' | 'go-to-time' | 'continue' | 'open-interaction' | 'play-sound' | 'none';
export type   InteractionEventDataType = GoToVideoEvent | GoToTimeEvent  | {};
export type ExerciseType = 'complete' | 'select';
export type CorrectionState = 'Not corrected' | boolean;
export type InputType = 'checkbox' | 'radio';

export interface UserVideoFields {
    startsIn: number;
    finishesIn:number;
    videoUrl: string;
    alias: string;
    isVideo:boolean
  }

  export interface TrimmedTime {
    min:number;
    max:number
  }


  export interface UserVideoFields {
    startsIn: number;
    finishesIn:number;
    videoUrl: string;
    alias: string;
    isVideo:boolean;
    trimmedPeriods:TrimmedTime[];
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
  

  
export interface InteractiveVideoNivelation {
  videoInfo:UserVideoFields
  questionResume:QuestionResume[]
}

export interface QuestionResume {
  id:number,
  question:string,
  options: OptionsAnswer[],
  uniqueAnswer:string,
  type:ExerciseType,
  positionInVideo:number,
  corrected:boolean,
  appearence:string;
  rewindAppearence:string;
  appearenceByTrim:AppearenceByTrim;
  rewindByTrim:AppearenceByTrim;
}

export interface AppearenceByTrim {
  trim:number,
  appearence:number
}

export interface InteractiveVideoExercise {
  exercise : QuestionResume
}

export interface OptionsAnswer {
  id:number,
  content:string
  isAnswer:boolean
}


