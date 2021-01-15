import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJobComponent } from './request-job.component';

describe('RequestJobComponent', () => {
  let component: RequestJobComponent;
  let fixture: ComponentFixture<RequestJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
