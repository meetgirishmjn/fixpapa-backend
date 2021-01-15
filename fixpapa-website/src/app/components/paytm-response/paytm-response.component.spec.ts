import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmResponseComponent } from './paytm-response.component';

describe('PaytmResponseComponent', () => {
  let component: PaytmResponseComponent;
  let fixture: ComponentFixture<PaytmResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
