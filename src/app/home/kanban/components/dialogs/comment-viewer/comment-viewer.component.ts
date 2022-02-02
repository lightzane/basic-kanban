import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../data.service';
import { Category } from '../../../models/category';
import { GlobalData } from '../../../models/global-data';
import { Item } from '../../../models/workflows';

@Component({
  selector: 'app-comment-viewer',
  templateUrl: './comment-viewer.component.html',
  styleUrls: ['./comment-viewer.component.scss']
})
export class CommentViewerComponent implements OnInit {

  globalData: GlobalData;
  item: Item;

  wfIndex: number;
  index: number;

  editMode = false;

  category: Category;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { wfIndex: number, index: number; },
    private dataService: DataService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.wfIndex = this.data.wfIndex;
    this.index = this.data.index;

    this.dataService.globalData$.subscribe((gd) => {
      this.globalData = gd;
      this.item = this.globalData.workflows[this.wfIndex].items[this.index];
      this.category = this.dataService.getCategories().find(v => v.color === this.item.color);
    });
  }

  commentDelete(commentIndex: number): void {
    this.globalData.workflows[this.wfIndex].items[this.index].comments.splice(commentIndex, 1);
    this.dataService.globalData$.next(this.globalData);
  }

  commentEditable(commentContent: HTMLParagraphElement, commentIndex: number): void {
    if (this.editMode === true) return;
    this.editMode = true;
    commentContent.contentEditable = 'true';
    commentContent.focus();
    commentContent.onblur = () => {
      commentContent.contentEditable = 'false';
      if (this.globalData.workflows[this.wfIndex].items[this.index].comments[commentIndex].content == commentContent.innerText) {
        this.editMode = false;
        return;
      };
      this.globalData.workflows[this.wfIndex].items[this.index].comments[commentIndex].content = commentContent.innerText;
      this.globalData.workflows[this.wfIndex].items[this.index].comments[commentIndex].edited = true;
      commentContent.innerText = this.globalData.workflows[this.wfIndex].items[this.index].comments[commentIndex].content; // to prevent weird duplication of last line
      this.dataService.globalData$.next(this.globalData);
      this.snackbar.open('Comment updated');
      this.editMode = false;
    };
  }

}
