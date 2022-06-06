import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoComposeService {

  @Output() continueVideo = new EventEmitter();

  constructor() { }
}
