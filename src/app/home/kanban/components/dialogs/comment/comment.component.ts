import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../data.service';
import { Category } from '../../../models/category';
import { Item } from '../../../models/workflows';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  category: Category;

  constructor(
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public item: Item
  ) {
    this.category = this.dataService.getCategories().find(v => v.color === item.color);
  }

  ngOnInit(): void {
  }

}
