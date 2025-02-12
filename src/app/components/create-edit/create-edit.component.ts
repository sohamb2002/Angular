import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post-service.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user-service.service';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: true,
  providers: [DialogService,UserService],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateEditComponent implements OnInit {
  postForm!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  postId: number | null = null;

  // Category list
  categories = [
    { label: 'Electronics', value: 1 },
    { label: 'SmartPhones', value: 2 },
    { label: 'Technology', value: 3 },
    { label: 'Science', value: 4 },
    { label: 'Health', value: 5 },
    { label: 'Education', value: 6 },
    { label: 'Finance', value: 7 },
    { label: 'Travel', value: 8 },
    { label: 'Entertainment', value: 9 },
    { label: 'Sports', value: 10 },
    { label: 'Lifestyle', value: 11 },
    { label: 'Business', value: 12 },
  ];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private userService: UserService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isPublished: [false],
      category: [null],
      createdBy: [null], // Auto-set this field
      email: ['', [Validators.required, Validators.email]], // User inputs email
      createdDate: [null],
      updatedAt: [null]
    });
  
 
    
    // Get data passed to the dialog
    this.postId = this.config.data?.postId || null;
    this.mode = this.postId ? 'edit' : 'create';

    if (this.mode === 'edit') {
      this.loadPostForEdit();
    } else {
      // Set createdAt and updatedAt for new posts
      const now = new Date().toISOString().split('Z')[0]; // Removes the 'Z' at the end
      console.log(now); // Example output: "2025-02-10T12:34:56.789"
      

      
      this.postForm.patchValue({
        createdDate: now,
        updatedAt: now
    
      });
     
      
    }
  }
  fetchUserIdByEmail(email: string | null): void {
   
    if (!email) return;

    this.userService.getUserIdByEmail(email).subscribe({
      next: (response) => {
        const userId = response?.id; // Directly accessing id from API response

        if (userId) {
          this.postForm.patchValue({ createdBy: userId });
          console.log(`User ID ${userId} mapped for email: ${email}`);
        } else {
          console.warn('User not found for email:', email);
        }
      },
      error: (error) => console.error('Error fetching user ID:', error),
    });
  }





  loadPostForEdit(): void {
    if (this.postId !== null) {
      this.postService.getPostById(this.postId).subscribe(response => {
        const post = response.data;
        this.postForm.patchValue({
          title: post.title || '',
          description: post.description || '',
          isPublished: post.isPublished ?? false,
          category: post.category || null,
          createdAt: post.createdAt || new Date(),
          updatedAt: post.updatedAt || new Date()
        });
      });
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const formData = this.postForm.value;
    formData.updatedAt = new Date(); // Always update the `updatedAt` field

    if (this.mode === 'create') {
      formData.createdAt = new Date(); // Ensure `createdAt` is set during creation
      this.postService.AddPost(formData).subscribe({
        next: () => {
          console.log('Post created successfully');
          this.ref.close(true);
        },
        error: error => console.error('Error creating post:', error)
      });
    } else if (this.postId !== null) {
      this.postService.UpdatePost(this.postId, formData).subscribe({
        next: () => {
          console.log('Post updated successfully');
          this.ref.close(true);
        },
        error: error => console.error('Error updating post:', error)
      });
    }
  }
}
