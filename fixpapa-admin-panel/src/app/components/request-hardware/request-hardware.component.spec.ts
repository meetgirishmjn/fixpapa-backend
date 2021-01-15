import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestHardwareComponent } from './request-hardware.component';

describe('RequestHardwareComponent', () => {
  let component: RequestHardwareComponent;
  let fixture: ComponentFixture<RequestHardwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestHardwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestHardwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
