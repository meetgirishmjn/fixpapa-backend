import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmRedirectComponent } from './paytm-redirect.component';

describe('PaytmRedirectComponent', () => {
  let component: PaytmRedirectComponent;
  let fixture: ComponentFixture<PaytmRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytmRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytmRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
