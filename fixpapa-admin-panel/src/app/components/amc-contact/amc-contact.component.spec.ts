import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcContactComponent } from './amc-contact.component';

describe('AmcContactComponent', () => {
  let component: AmcContactComponent;
  let fixture: ComponentFixture<AmcContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmcContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmcContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
