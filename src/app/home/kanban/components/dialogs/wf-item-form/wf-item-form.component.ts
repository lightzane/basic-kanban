import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../data.service';
import { Category } from '../../../models/category';
import { WfItemDialogData } from '../../../models/wf-item-dialog-data';

@Component({
  selector: 'app-wf-item-form',
  templateUrl: './wf-item-form.component.html',
  styleUrls: ['./wf-item-form.component.scss']
})
export class WfItemFormComponent implements OnInit {

  title: string;
  inputValue: string;
  btnText: string;
  btnColor: string;
  hintText: string;
  labelText: string;
  placeholderText: string;
  description: string;
  displayColors: boolean = false;
  color: string = 'transparent';
  categories: Category[] = [];
  isAddItem = false;
  selectedCategory: string;

  constructor(
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) private data: WfItemDialogData
  ) {
    this.categories = this.dataService.getCategories();
    this.selectedCategory = this.categories.find(v => v.color === data.input?.color)?.name;
  }

  ngOnInit(): void {

    if (this.data.type.match(/item/g)) {
      this.displayColors = true;
    }

    switch (this.data.type) {

      case 'wf-add': {
        this.title = 'Add a List';
        this.labelText = 'Workflow name';
        this.placeholderText = 'e.g. In Progress, Done';
        this.inputValue = '';
        this.hintText = 'The name of the list or workflow';
        this.btnText = 'Add Workflow';
        this.btnColor = 'primary';
        break;
      }

      case 'wf-rename': {
        this.title = 'Rename this Workflow';
        this.labelText = 'Workflow name';
        this.placeholderText = 'e.g. In Progress, Done';
        this.inputValue = this.data.input;
        this.hintText = 'Name or group your process';
        this.btnText = 'Update Workflow';
        this.btnColor = 'accent';
        break;
      }

      case 'item-add': {
        this.title = 'Add an Item';
        this.labelText = 'What to do?';
        this.placeholderText = 'e.g. Watch netflix';
        this.inputValue = '';
        this.hintText = 'Todo';
        this.description = '';
        this.btnText = 'Add Todo';
        this.btnColor = 'primary';
        this.isAddItem = true;
        break;
      }

      case 'item-rename': {
        this.title = 'Rename this item';
        this.labelText = 'What to do?';
        this.placeholderText = 'e.g. Watch netflix';
        this.inputValue = this.data.input.name;
        this.hintText = 'Todo';
        this.description = this.data.input.description;
        this.btnText = 'Update Todo';
        this.btnColor = 'accent';
        this.color = this.data.input.color;
        this.isAddItem = false;
        break;
      }
    }

  }

  chooseColor(name: string): void {
    this.color = name;
    this.isAddItem = false;
    this.selectedCategory = this.categories.find(c => c.color === name).name;
  }

  isTodo(): boolean {
    if (this.hintText.match(/todo/i)) return true;
    else return false;
  }

}
