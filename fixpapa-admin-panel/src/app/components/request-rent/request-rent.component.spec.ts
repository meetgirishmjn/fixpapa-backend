import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRentComponent } from './request-rent.component';

describe('RequestRentComponent', () => {
  let component: RequestRentComponent;
  let fixture: ComponentFixture<RequestRentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestRentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
