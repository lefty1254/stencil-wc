import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canny } from './canny';

describe('Canny', () => {
  let component: Canny;
  let fixture: ComponentFixture<Canny>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canny]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Canny);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
