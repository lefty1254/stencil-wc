import { Component, effect, inject, signal } from '@angular/core';

import { ImageStateService } from '../../core/state/image-state';


import { JsonPipe } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { EdgeDisplay } from '../../shared/edge-display/edge-display';


@Component({
  selector: 'app-workbench',
  imports: [EdgeDisplay,MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './workbench.html',
  styleUrl: './workbench.scss'
})
export class Workbench {
  readonly img = inject(ImageStateService);

  async onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) await this.img.loadFile(file);
  }
}


