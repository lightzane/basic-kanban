import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../data.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: Category[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private currentCategory: Category[]
  ) { }

  ngOnInit(): void {
    // to make a copy prevent 2-way-binding on original value (Use JSON.parse(JSON.stringify()))
    this.categories = JSON.parse(JSON.stringify(this.currentCategory));
  }

}
