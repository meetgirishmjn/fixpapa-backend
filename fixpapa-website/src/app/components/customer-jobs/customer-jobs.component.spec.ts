import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerJobsComponent } from './customer-jobs.component';

describe('CustomerJobsComponent', () => {
  let component: CustomerJobsComponent;
  let fixture: ComponentFixture<CustomerJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
