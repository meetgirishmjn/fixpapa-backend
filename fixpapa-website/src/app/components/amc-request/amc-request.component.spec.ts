import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcRequestComponent } from './amc-request.component';

describe('AmcRequestComponent', () => {
  let component: AmcRequestComponent;
  let fixture: ComponentFixture<AmcRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmcRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmcRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
