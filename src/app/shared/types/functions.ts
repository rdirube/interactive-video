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