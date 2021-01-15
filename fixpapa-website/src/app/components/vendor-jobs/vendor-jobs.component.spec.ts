import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorJobsComponent } from './vendor-jobs.component';

describe('VendorJobsComponent', () => {
  let component: VendorJobsComponent;
  let fixture: ComponentFixture<VendorJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
