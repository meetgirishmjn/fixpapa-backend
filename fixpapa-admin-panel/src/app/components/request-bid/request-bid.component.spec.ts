import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBidComponent } from './request-bid.component';

describe('RequestBidComponent', () => {
  let component: RequestBidComponent;
  let fixture: ComponentFixture<RequestBidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestBidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
