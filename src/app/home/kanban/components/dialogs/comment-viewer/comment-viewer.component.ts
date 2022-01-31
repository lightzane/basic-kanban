import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../data.service';
import { Item, Workflows } from '../../../models/workflows';

@Component({
  selector: 'app-comment-viewer',
  templateUrl: './comment-viewer.component.html',
  styleUrls: ['./comment-viewer.component.scss']
})
export class CommentViewerComponent implements OnInit {

  wf: Workflows[];
  item: Item;

  wfIndex: number;
  index: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { wfIndex: number, index: number; },
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.wfIndex = this.data.wfIndex;
    this.index = this.data.index;

    this.dataService.workflows$.subscribe((workflows) => {
      this.wf = workflows;
      this.item = this.wf[this.wfIndex].items[this.index];
    });
  }

  removeComment(commentIndex: number): void {
    this.wf[this.wfIndex].items[this.index].comments.splice(commentIndex, 1);
    this.dataService.workflows$.next(this.wf);
  }

}
