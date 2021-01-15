import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLoginSignupComponent } from './mobile-login-signup.component';

describe('MobileLoginSignupComponent', () => {
  let component: MobileLoginSignupComponent;
  let fixture: ComponentFixture<MobileLoginSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileLoginSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileLoginSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
