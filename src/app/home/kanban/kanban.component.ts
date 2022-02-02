import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { listAnim, slideIn } from '../../my-animations';
import { CategoryComponent } from './components/category/category.component';
import { CommentViewerComponent } from './components/dialogs/comment-viewer/comment-viewer.component';
import { CommentComponent } from './components/dialogs/comment/comment.component';
import { WfItemFormComponent } from './components/dialogs/wf-item-form/wf-item-form.component';
import { DataService } from './data.service';
import { Category } from './models/category';
import { GlobalData } from './models/global-data';
import { WfItemDialogData } from './models/wf-item-dialog-data';
import { Item, Workflows } from './models/workflows';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  animations: [listAnim, slideIn]
})
export class KanbanComponent implements OnInit {

  globalData: GlobalData;
  version: string;
  storageSize: number; // bytes
  maxStorageSize: number; // bytes
  totalStoragePercent: number;

  allSelected: boolean = true;
  selectedColors: string[] = [];
  colorList: string[] = [];

  categories: Category[];

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

    this.dataService.globalData$.subscribe((gd) => {
      this.globalData = gd;
      this.categories = [...gd.categories];

      // reset colorList
      this.colorList = [];

      for (let c of gd.categories) {
        this.colorList.push(c.color);
      }

      // Careful not to re-filter on changes in the workflows
      if (!this.selectedColors.length) {
        this.selectedColors = [...this.colorList];
        this.selectedColors.push('0'); // ALL
      }

      this.storageSize = this.dataService.getTotalSize();
      this.totalStoragePercent = (((this.storageSize) / this.maxStorageSize) * 100);

      this.saveDataToLocal();
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
        this.globalData.workflows[index].items.push({
          name: userInput.name,
          description: userInput.description,
          comments: [],
          color: userInput.color
        });
        this.dataService.globalData$.next(this.globalData);

        const cat = this.categories.find(v => v.color === userInput.color).name;
        this.snackbar.open(`Item added with ${cat} category`);
      }
    });
  }

  itemCommentView(wfIndex: number, index: number): void {
    this.dialog.open(CommentViewerComponent, {
      data: {
        wfIndex,
        index
      }
    });
  }

  itemDelete(wfIndex: number, index: number): void {
    this.globalData.workflows[wfIndex].items.splice(index, 1);
    this.snackbar.open(`Deleted successfully`);
    // this.dataService.workflows$.next(this.workflows);
    this.dataService.globalData$.next(this.globalData);
  }

  // * The "Item[]" in
  // * CdkDragDrop<Item[]> is taken via [cdkDropListData]="wf.items"
  // * where "wf.items" is an Item[] of Workflows
  // * if [cdkDropListData] is not provided
  // then event.[ container | previousContainer ].data will be undefined
  // else event.[ container | previousContainer ].data will now be a type of Item[]
  itemDrop(event: CdkDragDrop<Item[]>, index: number): void {

    if (event.container === event.previousContainer) {
      moveItemInArray(this.globalData.workflows[index].items, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    // this.dataService.workflows$.next(this.workflows);
    this.dataService.globalData$.next(this.globalData);
  }

  itemModify(wfIndex: number, index: number): void {

    const data: WfItemDialogData = {
      type: 'item-rename',
      input: {
        name: this.globalData.workflows[wfIndex].items[index].name,
        description: this.globalData.workflows[wfIndex].items[index].description || null,
        color: this.globalData.workflows[wfIndex].items[index].color
      }
    };
    const dialogRef = this.dialog.open(WfItemFormComponent, { data });
    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.globalData.workflows[wfIndex].items[index].name = userInput.name;
        this.globalData.workflows[wfIndex].items[index].description = userInput.description;
        this.globalData.workflows[wfIndex].items[index].color = userInput.color;
        // this.dataService.workflows$.next(this.workflows);
        this.dataService.globalData$.next(this.globalData);
        this.snackbar.open('Update successfully');
      }
    });
  }

  itemOpenCommentDialog(wfIndex: number, index: number): void {
    const item = this.globalData.workflows[wfIndex].items[index];
    const dialogRef = this.dialog.open(CommentComponent, { data: item });

    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.globalData.workflows[wfIndex].items[index].comments.unshift({
          content: userInput,
          timestamp: +new Date()
        });
        this.snackbar.open('Added comment');
        // this.dataService.workflows$.next(this.workflows);
        this.dataService.globalData$.next(this.globalData);
      }
    });
  }

  openCategory(): void {
    // to make a copy prevent 2-way-binding on original value (Use JSON.parse(JSON.stringify()))
    const currentCategory = JSON.parse(JSON.stringify(this.categories));
    const dialogRef = this.dialog.open(CategoryComponent, { data: currentCategory });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.globalData.categories = data;
        this.dataService.globalData$.next(this.globalData);
        this.snackbar.open('Categories updated successfully');
      } else {
        this.categories = [...currentCategory];
      }
    });
  }

  saveDataToLocal(): void {
    const data = JSON.stringify(this.globalData);
    localStorage.setItem('global-data', data);
  }

  /**
   * 
   * @param ignore if true - let the checkbox ngModel change the boolean
   */
  selectAllCategory(ignore: boolean = true): void {
    if (this.allSelected) {
      this.selectedColors = [];
    } else {
      this.selectedColors = [...this.colorList];
      this.selectedColors.push('0');
    }

    if (ignore) this.allSelected = !this.allSelected;
  }

  selectNotAll(): void {
    this.selectedColors = [...this.selectedColors.filter(v => v !== '0')];
    if (this.selectedColors.length === this.colorList.length) {
      this.allSelected = true;
      this.selectedColors.push('0'); // to display "ALL"
    } else {
      this.allSelected = false;
    }
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
        this.globalData.workflows.push({ name: userInput.name, items: [] });
        this.dataService.globalData$.next(this.globalData);
      }
    });
  }

  wfDelete(index: number): void {
    const [list] = this.globalData.workflows.splice(index, 1);
    this.snackbar.open(`Deleted successfully:  ${list.name}`, 'OK');
    this.dataService.globalData$.next(this.globalData);
  }

  wfDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.globalData.workflows, event.previousIndex, event.currentIndex);
    this.dataService.globalData$.next(this.globalData);
  }

  wfRename(index: number): void {
    const data: WfItemDialogData = {
      type: 'wf-rename',
      input: this.globalData.workflows[index].name
    };

    const dialogRef = this.dialog.open(WfItemFormComponent, { data });
    dialogRef.afterClosed().subscribe((userInput) => {
      if (userInput) {
        this.globalData.workflows[index].name = userInput.name;
        this.dataService.globalData$.next(this.globalData);
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
