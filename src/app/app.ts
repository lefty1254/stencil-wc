import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Workbench } from "./features/workbench/workbench";

declare const cv: any; // from opencv.js

@Component({
  selector: 'app-root',
  imports: [ Workbench],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
}
