import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Workbench } from "./features/workbench/workbench";
import { ImageStateService } from './core/state/image-state';

declare const cv: any; // from opencv.js

@Component({
  selector: 'app-root',
  imports: [ Workbench],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  theme = inject(ImageStateService).themeMode;
  
}
