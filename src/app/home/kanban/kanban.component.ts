import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { listAnim, slideIn } from '../../my-animations';
import { CommentViewerComponent } from './components/dialogs/comment-viewer/comment-viewer.component';
import { CommentComponent } from './components/dialogs/comment/comment.component';
import { WfItemFormComponent } from './components/dialogs/wf-item-form/wf-item-form.component';
import { DataService } from './data.service';
import { WfItemDialogData } from './models/wf-item-dialog-data';
import { Item, Workflows } from './models/workflows';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  animations: [listAnim, slideIn]
})
export class KanbanComponent implements OnInit {

  workflows: Workflows[];// = JSON.parse(localStorage.getItem('data')) || [];
  version: string;
  storageSize: number; // bytes
  maxStorageSize: number; // bytes
  totalStoragePercent: number;

  /** 
   * Display consent info to user
   * 
   * (the one displayed in the lower bottom of the screen) 
   */
  docsCookies: boolean = false;

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit(): void {

    this.version = this.dataService.getVersion();
    this.maxStorageSize = this.dataService.getBrowserMaxStorage() * 1024; // convert to bytes;

    this.dataService.workflows$.subscribe((workflows) => {
      this.workflows = workflows;
      this.saveDataToLocal();
      this.storageSize = this.dataService.getTotalSize();
      this.totalStoragePercent = (((this.storageSize) / this.maxStorageSize) * 100);
    });

    if (localStorage.getItem('docs-cookies') === 'true') {
      this.docsCookies = true;
    }
  }

  itemAdd(index: number): void {
    const data: WfItemDialogData = { type: 'item-add' };
    const dialogRef = this.dialog.open(WfItemFormComponent, { data });

    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.workflows[index].items.push({
          name: userInput.name,
          description: userInput.description,
          comments: [],
          color: userInput.color
        });
        this.dataService.workflows$.next(this.workflows);
      }
    });
  }

  itemCommentView(wfIndex: number, index: number): void {
    const item = this.workflows[wfIndex].items[index];
    this.dialog.open(CommentViewerComponent, {
      data: {
        wfIndex,
        index
      }
    });
  }

  itemDelete(wfIndex: number, index: number): void {
    this.workflows[wfIndex].items.splice(index, 1);
    this.snackbar.open(`Deleted successfully`);
    this.dataService.workflows$.next(this.workflows);
  }

  // * The "Item[]" in
  // * CdkDragDrop<Item[]> is taken via [cdkDropListData]="wf.items"
  // * where "wf.items" is an Item[] of Workflows
  // * if [cdkDropListData] is not provided
  // then event.[ container | previousContainer ].data will be undefined
  // else event.[ container | previousContainer ].data will now be a type of Item[]
  itemDrop(event: CdkDragDrop<Item[]>, index: number): void {

    if (event.container === event.previousContainer) {
      moveItemInArray(this.workflows[index].items, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    this.dataService.workflows$.next(this.workflows);
  }

  itemModify(wfIndex: number, index: number): void {

    const data: WfItemDialogData = {
      type: 'item-rename',
      input: {
        name: this.workflows[wfIndex].items[index].name,
        description: this.workflows[wfIndex].items[index].description || null,
        color: this.workflows[wfIndex].items[index].color
      }
    };
    const dialogRef = this.dialog.open(WfItemFormComponent, { data });
    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.workflows[wfIndex].items[index].name = userInput.name;
        this.workflows[wfIndex].items[index].description = userInput.description;
        this.workflows[wfIndex].items[index].color = userInput.color;
        this.dataService.workflows$.next(this.workflows);
        this.snackbar.open('Update successfully');
      }
    });
  }

  itemOpenCommentDialog(wfIndex: number, index: number): void {
    const item = this.workflows[wfIndex].items[index];
    const dialogRef = this.dialog.open(CommentComponent, { data: item });

    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.workflows[wfIndex].items[index].comments.unshift({
          content: userInput,
          timestamp: +new Date()
        });
        this.snackbar.open('Added comment');
        this.dataService.workflows$.next(this.workflows);
      }
    });
  }

  saveDataToLocal(): void {
    const data = JSON.stringify(this.workflows);
    localStorage.setItem('data', data);
  }

  userGotIt(): void {
    localStorage.setItem('docs-cookies', 'true');
    this.docsCookies = true;
  }

  wfAdd(): void {
    const data: WfItemDialogData = { type: 'wf-add' };
    const dialogRef = this.dialog.open(WfItemFormComponent, { data });

    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.workflows.push({ name: userInput.name, items: [] });
        this.dataService.workflows$.next(this.workflows);
      }
    });
  }

  wfDelete(index: number): void {
    const [list] = this.workflows.splice(index, 1);
    this.snackbar.open(`Deleted successfully:  ${list.name}`, 'OK');
    this.dataService.workflows$.next(this.workflows);
  }

  wfDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.workflows, event.previousIndex, event.currentIndex);
    this.dataService.workflows$.next(this.workflows);
  }

  wfRename(index: number): void {
    const data: WfItemDialogData = {
      type: 'wf-rename',
      input: this.workflows[index].name
    };

    const dialogRef = this.dialog.open(WfItemFormComponent, { data });
    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.workflows[index].name = userInput.name;
        this.dataService.workflows$.next(this.workflows);
      }
    });
  }

  // generateRandomStrings(n = 25): string {
  //   let result = '';
  //   let str = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  //   let strLen = str.length;

  //   for (let i = 0; i < n; i++) {
  //     result += str.charAt(Math.floor(Math.random() * strLen));
  //   }

  //   return result;
  // }

}
