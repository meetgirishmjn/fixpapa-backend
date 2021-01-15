import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorModalComponent } from './vendor-modal.component';

describe('VendorModalComponent', () => {
  let component: VendorModalComponent;
  let fixture: ComponentFixture<VendorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
