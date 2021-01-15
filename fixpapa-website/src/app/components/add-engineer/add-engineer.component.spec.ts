import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEngineerComponent } from './add-engineer.component';

describe('AddEngineerComponent', () => {
  let component: AddEngineerComponent;
  let fixture: ComponentFixture<AddEngineerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEngineerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEngineerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
