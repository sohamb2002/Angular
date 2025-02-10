import { TestBed } from '@angular/core/testing';

import { CreateEditDialogService } from './create-edit-dialog.service';

describe('CreateEditDialogService', () => {
  let service: CreateEditDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateEditDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
