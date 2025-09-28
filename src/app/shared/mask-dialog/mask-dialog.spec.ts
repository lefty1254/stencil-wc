import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskDialog } from './mask-dialog';

describe('MaskDialog', () => {
  let component: MaskDialog;
  let fixture: ComponentFixture<MaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaskDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
