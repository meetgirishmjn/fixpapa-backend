import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAmcComponent } from './request-amc.component';

describe('RequestAmcComponent', () => {
  let component: RequestAmcComponent;
  let fixture: ComponentFixture<RequestAmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
