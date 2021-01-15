import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentASystemComponent } from './rent-a-system.component';

describe('RentASystemComponent', () => {
  let component: RentASystemComponent;
  let fixture: ComponentFixture<RentASystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentASystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentASystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
