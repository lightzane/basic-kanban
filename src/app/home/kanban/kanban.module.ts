import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanComponent } from './kanban.component';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WfItemFormComponent } from './components/dialogs/wf-item-form/wf-item-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommentComponent } from './components/dialogs/comment/comment.component';
import { CommentViewerComponent } from './components/dialogs/comment-viewer/comment-viewer.component';
import { DateAgoPipe } from '../../shared/pipes/date-ago.pipe';

const routes: Routes = [
  {
    path: '',
    component: KanbanComponent
  }
];

@NgModule({
  declarations: [
    KanbanComponent,
    WfItemFormComponent,
    CommentComponent,
    CommentViewerComponent,
    DateAgoPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTooltipModule
  ]
})
export class KanbanModule { }
