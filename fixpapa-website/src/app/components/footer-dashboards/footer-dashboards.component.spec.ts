import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterDashboardsComponent } from './footer-dashboards.component';

describe('FooterDashboardsComponent', () => {
  let component: FooterDashboardsComponent;
  let fixture: ComponentFixture<FooterDashboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterDashboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
