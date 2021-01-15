import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarePurchaseComponent } from './hardware-purchase.component';

describe('HardwarePurchaseComponent', () => {
  let component: HardwarePurchaseComponent;
  let fixture: ComponentFixture<HardwarePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwarePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwarePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
