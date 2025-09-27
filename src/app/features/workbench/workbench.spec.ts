import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workbench } from './workbench';

describe('Workbench', () => {
  let component: Workbench;
  let fixture: ComponentFixture<Workbench>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workbench]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Workbench);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
