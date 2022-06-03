import { EventEmitter, Injectable } from '@angular/core';
import { AnswerService, GameActionsService, MicroLessonMetricsService } from 'micro-lesson-core';
import { UserAnswer } from 'ox-types';


@Injectable({
  providedIn: 'root'
})
export class InteractiveVideoAnswerService extends AnswerService {

  protected override isValidAnswer(answer: UserAnswer): boolean {
    return this.currentAnswer.parts!.every(part => part.parts.every(part => part.value !== null))
  }

  constructor(private gameActionsService: GameActionsService<any>,
    m: MicroLessonMetricsService<any>,) {
    super(gameActionsService,m);
  }
}
