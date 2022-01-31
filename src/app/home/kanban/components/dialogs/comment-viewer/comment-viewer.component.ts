import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  editMode = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { wfIndex: number, index: number; },
    private dataService: DataService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.wfIndex = this.data.wfIndex;
    this.index = this.data.index;

    this.dataService.workflows$.subscribe((workflows) => {
      this.wf = workflows;
      this.item = this.wf[this.wfIndex].items[this.index];
    });
  }

  commentDelete(commentIndex: number): void {
    this.wf[this.wfIndex].items[this.index].comments.splice(commentIndex, 1);
    this.dataService.workflows$.next(this.wf);
  }

  commentEditable(commentContent: HTMLParagraphElement, commentIndex: number): void {
    if (this.editMode === true) return;
    this.editMode = true;
    commentContent.contentEditable = 'true';
    commentContent.focus();
    commentContent.onblur = () => {
      commentContent.contentEditable = 'false';
      if (this.wf[this.wfIndex].items[this.index].comments[commentIndex].content == commentContent.innerText) {
        this.editMode = false;
        return;
      };
      this.wf[this.wfIndex].items[this.index].comments[commentIndex].content = commentContent.innerText;
      this.wf[this.wfIndex].items[this.index].comments[commentIndex].edited = true;
      commentContent.innerText = this.wf[this.wfIndex].items[this.index].comments[commentIndex].content; // to prevent weird duplication of last line
      this.dataService.workflows$.next(this.wf);
      this.snackbar.open('Comment updated');
      this.editMode = false;
    };
  }

}
