import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPartsComponent } from './request-parts.component';

describe('RequestPartsComponent', () => {
  let component: RequestPartsComponent;
  let fixture: ComponentFixture<RequestPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
