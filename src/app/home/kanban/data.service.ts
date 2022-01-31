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
  }

  getWorkflowsAsString(): string {
    return JSON.stringify(this.savedWorkflows);
  }

  getVersion(): string {
    return packageJson.version;
  }
}
