import { Component, OnInit } from '@angular/core';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { ExerciseOx } from 'ox-core';
import { InteractiveVideoChallengeService } from 'src/app/shared/services/interactive-video-challenge.service';
import { InteractiveVideoExercise, InteractiveVideoNivelation } from 'src/app/shared/types/types';
import { filter, take, timer } from 'rxjs';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit {
  

  public exercise!: any;
  public questionOn!:boolean;


  constructor(private challengeService: InteractiveVideoChallengeService) { 
    super()
    this.exercise = JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"interactive-video-creator","type":"challenges","screenTheme":"executive-functions","exerciseCount":1,"microLessonGameInfo":{"questionResume":[{"id":0,"question":"Seleccionar los números pares menores a 30","options":[{"content":"1","isAnswer":true},{"content":"2","isAnswer":false},{"content":"3","isAnswer":true}],"type":"select","uniqueAnswer":null,"positionInVideo":null,"corrected":false,"appearence":"00:07","rewindAppearence":"00:19"}],"videoInfo":{"videoUrl":"//www.youtube.com/v/qUJYqhKZrwA?autoplay=1&showinfo=0&controls=0","isVideo":true,"startsIn":47,"finishesIn":158,"alias":"Pepe"}},"extraInfo":{"gameUrl":"https://text-structure.web.app","theme":"volcano","exerciseCase":"created","language":"ESP"}},"format":"interactive-video-creator","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"interactive-video-creator","url":"https://ml-screen-manager.firebaseapp.com"}}}').properties.customConfig.creatorInfo?.microLessonGameInfo;
    this.questionOn = false;
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
    (exercise: ExerciseOx<InteractiveVideoExercise>) => {
      this.exercise = exercise.exerciseData;
    });
    console.log(this.exercise);
  }

  ngOnInit(): void {
  }

}
