import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageStateService } from '../../../core/state/image-state';
import { CannyParams } from 'opencv-ng';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EdgeDisplay } from '../../../shared/edge-display/edge-display';
import { MatSliderModule, MatSliderRangeThumb } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'algo-canny',
  imports: [FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule, MatButtonModule, EdgeDisplay,MatSliderRangeThumb, MatTooltipModule
  ],
  templateUrl: './canny.html',
  styleUrl: './canny.scss'
})
export class Canny {

  readonly img = inject(ImageStateService);

  // Params as signals
  readonly low = signal(100);
  readonly high = signal(200);
  readonly thickness = signal(1);
  readonly base = signal<'none' | 'original' | 'gray'>('gray');

  readonly baseImage = computed<ImageData | null>(() => {
    switch (this.base()) {
      case 'original': return this.img.src();
      case 'gray': return this.img.grayRes.hasValue() ? this.img.grayRes.value() : null;
      default: return null; // 'none' => mask only
    }
  });

  // Packed params, typed
  readonly cannyParams = computed<CannyParams>(() => {
    console.log('Canny params recomputed');
    const val: CannyParams = {
      low: this.low(),
      high: this.high(),
      thickness: this.thickness(),
    }
    return val;
  });

  // Ask ImageState for a mask resource bound to our params
  readonly maskRes = this.img.cannyMaskRes(this.cannyParams);





}
