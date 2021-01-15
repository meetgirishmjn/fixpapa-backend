import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnCodesComponent } from './hsn-codes.component';

describe('HsnCodesComponent', () => {
  let component: HsnCodesComponent;
  let fixture: ComponentFixture<HsnCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
