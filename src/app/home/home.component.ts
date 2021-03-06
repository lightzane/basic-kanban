import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { initialCategory } from '../shared/constants/initial-category';
import { FileImportConfirmDialogComponent } from './components/dialogs/file-import-confirm/file-import-confirm.component';
import { DataService } from './kanban/data.service';
import { GlobalData } from './kanban/models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  isDark: boolean;
  isHandset$: Observable<boolean>;
  hasData: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    // private overlayContainer: OverlayContainer,
    private dataService: DataService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {

    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map((bp) => bp.matches),
        shareReplay(1) // share only the last boolean value
      );

    // const theme = localStorage.getItem('theme');
    // this.isDark = theme === 'dark' ? true : false;
  }

  ngOnInit(): void {
    // this.applyDarkDialog();
    this.dataService.globalData$.subscribe((data) => {
      if (data) this.hasData = true;
      else this.hasData = false;
    });
  }

  /**
   * Apply dark theme to mat-dialog components
   * And also save `dark` to localStorage
   */
  // applyDarkDialog(): void {
  //   if (this.isDark) {
  //     this.overlayContainer.getContainerElement().classList.add('dark-theme');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     this.overlayContainer.getContainerElement().classList.remove('dark-theme');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }

  dataDelete(): void {
    const dialogRef = this.dialog.open(FileImportConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.dataService.globalData$.next({ categories: initialCategory, workflows: [] });
        this.snackbar.open('All data cleared successfully', 'OK');
      }
    });
  }

  dataExport(): void {
    const data = this.dataService.getGlobalDataAsString();
    this.downloadData('basic-kanban.txt', data);
  }

  onFileSelect(event: Event, fileInput: HTMLInputElement): void {

    const { target } = event;
    const { files } = target as HTMLInputElement;

    const file: File = files[0];

    const fileReader = new FileReader();
    fileReader.readAsText(file, 'utf-8');

    fileReader.onload = ((fileLoadedEvent) => {

      const fileContent = fileLoadedEvent.target.result as string;

      if (!file.name.match(/\.txt$/)) {
        return;
      }

      const parsedContent = JSON.parse(fileContent);
      let gd: GlobalData;

      if (!parsedContent.workflows && !parsedContent.categories) {
        // it must be coming from an old data
        gd = {
          workflows: parsedContent,
          categories: initialCategory
        };
      } else {
        gd = parsedContent;
      }

      if (!gd) return;

      this.dataService.globalData$.next(gd);
      fileInput.value = ''; // to be able to re-read the same uploaded file name
    });

  }

  openDialog(fileInput: HTMLInputElement): void {
    if (this.dataService.getGlobalDataAsString() === '[]') {
      fileInput.click();
    } else {
      const dialogRef = this.dialog.open(FileImportConfirmDialogComponent);
      dialogRef.afterClosed().subscribe((isConfirmed) => {
        if (isConfirmed) {
          fileInput.click();
        }
      });
    }
  }

  private downloadData(filename: string, data: string): void {
    // Create element <a> tag
    const download = document.createElement('a');
    download.style.display = 'none';
    // Set filename when downloading
    download.setAttribute('download', filename);
    // Set content
    download.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
    );
    // Append the element to the body
    document.body.appendChild(download);
    // Simulate click
    download.click();
    // Remove the element
    document.body.removeChild(download);
  }

  // toggleSidenav(sidenav: MatSidenav): void {
  //   this.isHandset$.subscribe((bool) => {
  //     if (bool === true) sidenav.toggle();
  //   });
  // }

  // toggleTheme(): void {
  //   this.isDark = !this.isDark;
  //   this.applyDarkDialog();
  // }

}
