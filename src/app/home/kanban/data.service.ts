import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workflows } from './models/workflows';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private savedWorkflows = JSON.parse(localStorage.getItem('data')) || [];
  workflows$ = new BehaviorSubject<Workflows[]>(this.savedWorkflows);

  constructor() { }

  getWorkflowsAsString(): string {
    return JSON.stringify(this.savedWorkflows);
  }
}
