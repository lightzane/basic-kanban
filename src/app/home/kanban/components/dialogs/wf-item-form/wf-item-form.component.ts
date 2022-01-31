import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  displayColors: boolean = false;
  color: string = 'transparent';
  colors = ['transparent', 'skyblue', '#2ecc71', '#e74c3c', 'yellow', 'orange', 'black', 'gray'];

  constructor(@Inject(MAT_DIALOG_DATA) private data: WfItemDialogData) { }

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
        this.hintText = 'Todo';
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
        this.btnText = 'Add Todo';
        this.btnColor = 'primary';
        break;
      }

      case 'item-rename': {
        this.title = 'Rename this item';
        this.labelText = 'What to do?';
        this.placeholderText = 'e.g. Watch netflix';
        this.inputValue = this.data.input.name;
        this.hintText = 'Todo';
        this.btnText = 'Update Todo';
        this.btnColor = 'accent';
        this.color = this.data.input.color;
        break;
      }
    }

  }

  chooseColor(name: string): void {
    this.color = name;
  }

}
