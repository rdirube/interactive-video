import { Component, Input, OnInit } from '@angular/core';
import { InteractiveVideoExercise } from 'src/app/shared/types/types';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  @Input() exercise!:any;
   

  constructor() { }

  ngOnInit(): void {
  }


  get currentExercise(): any {
    return this.exercise.questionResume[0];
  }

}
