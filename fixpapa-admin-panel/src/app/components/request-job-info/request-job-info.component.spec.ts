import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJobInfoComponent } from './request-job-info.component';

describe('RequestJobInfoComponent', () => {
  let component: RequestJobInfoComponent;
  let fixture: ComponentFixture<RequestJobInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestJobInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestJobInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
