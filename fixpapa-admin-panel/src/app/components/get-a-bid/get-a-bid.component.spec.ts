import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetABidComponent } from './get-a-bid.component';

describe('GetABidComponent', () => {
  let component: GetABidComponent;
  let fixture: ComponentFixture<GetABidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetABidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetABidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
