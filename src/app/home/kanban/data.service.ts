import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workflows } from './models/workflows';
import packageJson from './../../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private savedWorkflows = JSON.parse(localStorage.getItem('data')) || [];
  workflows$ = new BehaviorSubject<Workflows[]>(this.savedWorkflows);

  constructor() {
    this.workflows$.subscribe((data) => {
      this.savedWorkflows = data;
    });

    this.identifyBrowserMaxStorage();
  }

  private identifyBrowserMaxStorage(): void {
    // browser storage total size
    if (!localStorage.getItem('_bts')) {
      let i = 0;
      try {
        // Test up to 10 MB
        for (i = 0; i <= 10000; i += 250) {
          localStorage.setItem('test', insertA(i));
        }
      } catch (err) {
        localStorage.removeItem('test');
        localStorage.setItem('_bts', (i ? i - 250 : 0).toString());
      }
    }

    function insertA(num: number) {
      return new Array((num * 1024) + 1).join('a');
    }

    /**
     * Reference
     * https://www.geeksforgeeks.org/what-is-the-max-size-of-localstorage-values/
     */
  }

  /**
   * Get the browser's max storage
   * @returns storage size in kilobytes
   */
  getBrowserMaxStorage(): number {
    return +localStorage.getItem('_bts');
  }

  getTotalSize(measurement: 'bytes' | 'kb' | 'mb' = 'bytes'): number {
    let total: number = 0;

    for (let keys in localStorage) {
      if (!localStorage[keys].length) continue;

      // console.log(`localStorage[keys]`, localStorage[keys].length);
      // console.log(`keys`, keys.length);
      // console.log(keys);

      const length = ((localStorage[keys].length + keys.length) * 2);
      total += length;
    }

    // 1 kilobytes (kb) = 1024 bytes
    // 1 megabytes (mb) = 1024 kilobytes
    switch (measurement) {
      case 'bytes': {
        return total;
      }
      case 'kb': {
        return total / 1024;
      }
      case 'mb': {
        return total / 1024 / 1024;
      }
    }


    /**
     * The calculation includes the length of the key itself. 
     * Each length is multiplied by 2 because the char in javascript stores as UTF-16 (occupies 2 bytes)
     * 
     * Reference:
     * https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
     */
  }

  getWorkflowsAsString(): string {
    return JSON.stringify(this.savedWorkflows);
  }

  getVersion(): string {
    return packageJson.version;
  }
}
