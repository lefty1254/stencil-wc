import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EdgeDisplay } from '../../../shared/edge-display/edge-display';
import { EdgeAlgoId, SobelParams } from 'opencv-ng';
import { ImageStateService } from '../../../core/state/image-state';

@Component({
  selector: 'algo-sobel',
  imports: [
    FormsModule,
    MatCardModule, MatSliderModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    EdgeDisplay],
  templateUrl: './sobel.html',
  styleUrl: './sobel.scss'
})
export class Sobel {
  readonly img = inject(ImageStateService);

  // readonly ksizes = [1,3,5,7];
  readonly ksize = signal<number>(3);
  readonly scale = signal<number>(1);
  readonly delta = signal<number>(0);
  readonly thickness = signal<number>(1);
  readonly base = signal<'none'|'original'|'gray'>('none');

  readonly sobelParams = computed<SobelParams>(() => ({
    ksize: this.ksize(),
    scale: this.scale(),
    delta: this.delta(),
    thickness: this.thickness(),
  }));

  readonly maskRes = this.img.edgeMaskRes(EdgeAlgoId.Sobel, this.sobelParams);
  readonly mask = computed(() => {
    return this.maskRes.hasValue() ? this.maskRes.value() : null;
  })

  readonly baseImage = computed<ImageData | null>(() => {
    switch (this.base()) {
      case 'original': return this.img.src();
      case 'gray':     return this.img.grayRes.hasValue() ? this.img.grayRes.value() : null;
      default:         return null;
    }
  });

}
