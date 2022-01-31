import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImportConfirmComponent } from './file-import-confirm.component';

describe('FileImportConfirmComponent', () => {
  let component: FileImportConfirmComponent;
  let fixture: ComponentFixture<FileImportConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileImportConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileImportConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
