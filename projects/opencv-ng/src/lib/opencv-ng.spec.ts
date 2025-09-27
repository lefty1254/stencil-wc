import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpencvNg } from './opencv-ng';

describe('OpencvNg', () => {
  let component: OpencvNg;
  let fixture: ComponentFixture<OpencvNg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpencvNg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpencvNg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
