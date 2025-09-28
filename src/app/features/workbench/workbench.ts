import { Component, inject } from '@angular/core';
import { ImageStateService } from '../../core/state/image-state';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { EdgeDisplay } from '../../shared/edge-display/edge-display';
import { Canny } from '../algorithms/canny/canny';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Sobel } from '../algorithms/sobel/sobel';



@Component({
  selector: 'app-workbench',
  imports: [EdgeDisplay, MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule, Canny, MatSlideToggleModule, Sobel, FormsModule],
  templateUrl: './workbench.html',
  styleUrl: './workbench.scss'
})
export class Workbench {
  readonly img = inject(ImageStateService);
  themeToggle = this.img.themeMode;

  async onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) await this.img.loadFile(file);
  }
}


