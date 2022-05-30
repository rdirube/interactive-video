import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TypographyOxModule } from 'typography-ox';
import { MicroLessonComponentsModule } from 'micro-lesson-components';
import { NgoxPostMessageModule } from 'ngox-post-message';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
    FlexLayoutModule,
    NgoxPostMessageModule

  ],
  exports: [
    MicroLessonComponentsModule,
    TypographyOxModule,
    FlexLayoutModule,
    NgoxPostMessageModule
  ]
})
export class SharedModule { }
