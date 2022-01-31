import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  isDark: boolean;
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private overlayContainer: OverlayContainer
  ) {

    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map((bp) => bp.matches),
        shareReplay(1) // share only the last boolean value
      );

    const theme = localStorage.getItem('theme');
    this.isDark = theme === 'dark' ? true : false;
  }

  ngOnInit(): void {
    this.applyDarkDialog();
  }

  /**
   * Apply dark theme to mat-dialog components
   * And also save `dark` to localStorage
   */
  applyDarkDialog(): void {
    if (this.isDark) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  // toggleSidenav(sidenav: MatSidenav): void {
  //   this.isHandset$.subscribe((bool) => {
  //     if (bool === true) sidenav.toggle();
  //   });
  // }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    this.applyDarkDialog();
  }

}
