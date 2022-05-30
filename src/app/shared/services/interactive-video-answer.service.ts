import { EventEmitter, Injectable } from '@angular/core';
import { AnswerService, GameActionsService, MicroLessonMetricsService } from 'micro-lesson-core';
import { UserAnswer } from 'ox-types';


@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoAnswerService extends AnswerService {

  constructor(private gameActionsService: GameActionsService<any>,
    m: MicroLessonMetricsService<any>,) {
    super(gameActionsService,m);
  }
}
