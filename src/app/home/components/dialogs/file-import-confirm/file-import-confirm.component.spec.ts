import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImportConfirmDialogComponent } from './file-import-confirm.component';

describe('FileImportConfirmDialogComponent', () => {
  let component: FileImportConfirmDialogComponent;
  let fixture: ComponentFixture<FileImportConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileImportConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileImportConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
