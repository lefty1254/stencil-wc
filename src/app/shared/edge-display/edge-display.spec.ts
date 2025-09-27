import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeDisplay } from './edge-display';

describe('EdgeDisplay', () => {
  let component: EdgeDisplay;
  let fixture: ComponentFixture<EdgeDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdgeDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdgeDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
