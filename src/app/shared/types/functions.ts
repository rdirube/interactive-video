import { UserVideoFields } from "./types";


export function getYouTubeId(url: string) {
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
  }
  
  export function createVideoInfo(): UserVideoFields {
    return {
      videoUrl: '//www.youtube.com/v/qUJYqhKZrwA?autoplay=1&showinfo=0&controls=0',
      startsIn: 0,
      finishesIn: 0,
      alias: 'Pepe',
      isVideo:true
    };
  }


  export function vhToPx(vh:number, documentSize:number) {
   return vh*documentSize/100
  }

  export function secondsToHHMMSS(seconds: number) {
    return seconds < 3600 ? new Date(seconds * 1000).toISOString().substr(14, 5)
      : new Date(seconds * 1000).toISOString().substr(11, 8);
  }
  
  export function HHMMSStoNumberFromString(hour:string):number {
    const [ minutes, seconds] = hour.split(':');
    const totalSeconds = (+minutes) * 60 + (+seconds);
    return totalSeconds
  }