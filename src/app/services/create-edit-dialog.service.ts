import { Injectable } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { CreateEditComponent } from '../components/create-edit/create-edit.component';

@Injectable({
  providedIn: 'root',
})
export class CreateEditDialogService {
  constructor(private dialogService: DialogService) {}

  openCreateDialog(): DynamicDialogRef {
    return this.dialogService.open(CreateEditComponent, {
      header: 'Create New Post',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  openEditDialog(postId: number): DynamicDialogRef {
    return this.dialogService.open(CreateEditComponent, {
      header: 'Edit Post',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { postId }, // Pass the postId to the dialog
    });
  }
}