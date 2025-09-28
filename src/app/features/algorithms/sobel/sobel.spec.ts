import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sobel } from './sobel';

describe('Sobel', () => {
  let component: Sobel;
  let fixture: ComponentFixture<Sobel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sobel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sobel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
