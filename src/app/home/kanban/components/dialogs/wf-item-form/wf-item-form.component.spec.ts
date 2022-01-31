import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfItemFormComponent } from './wf-item-form.component';

describe('ListItemFormComponent', () => {
  let component: WfItemFormComponent;
  let fixture: ComponentFixture<WfItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WfItemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
