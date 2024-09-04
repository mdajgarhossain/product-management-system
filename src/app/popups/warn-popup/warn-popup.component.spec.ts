import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnPopupComponent } from './warn-popup.component';

describe('WarnPopupComponent', () => {
  let component: WarnPopupComponent;
  let fixture: ComponentFixture<WarnPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarnPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarnPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
