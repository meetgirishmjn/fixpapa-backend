import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidRequestComponent } from './bid-request.component';

describe('BidRequestComponent', () => {
  let component: BidRequestComponent;
  let fixture: ComponentFixture<BidRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
