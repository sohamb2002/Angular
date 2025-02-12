import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post-service.service';
import { Post } from '../../models/post';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { CreateEditDialogService } from '../../services/create-edit-dialog.service';
import Swal from 'sweetalert2';
import { PaginatorModule } from 'primeng/paginator';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CardModule, ButtonModule, ReactiveFormsModule, CommonModule, DropdownModule, TagModule, FormsModule, PaginatorModule],
  providers: [DialogService, PostService, CreateEditDialogService],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  postForm!: FormGroup;
  visible: boolean = false;
  searchQuery: string = "";
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
  first: number = 0;
  rows: number = 6; // Number of items per page

  constructor(
    private postService: PostService,
    private router: Router,
    private fb: FormBuilder,
    private dialogService: CreateEditDialogService,
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    console.log('Fetching posts...');
    this.postService.getAllPosts().subscribe(
      (response) => {
        console.log('API Response:', response);
        if (response && Array.isArray(response.data)) {
          this.posts = response.data
            .filter((post: any) => !post.isDeleted)
            .map((post: any) => ({
              ...post,
              createdDate: post.createdDate || new Date().toISOString(),
              updatedAt: post.updatedAt || post.createdDate || new Date().toISOString(),
            }));
        } else {
          console.error('Invalid API response format:', response);
          this.posts = [];
        }
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  get filteredPosts() {
    return this.posts.filter((p) =>
      p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    ).slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  handleFormSubmit(formData: any) {
    console.log('Form Data:', formData);
    this.ngOnInit;
  }

  fetchPublishedPosts(): void {
    console.log('fetching published posts');
    this.postService.GetAllPublishedPosts().subscribe(
      (response) => {
        console.log('All published posts:', response);
        if (response && Array.isArray(response.data)) {
          this.posts = response.data;
        } else {
          console.error('Invalid API response format for published posts:', response);
          this.posts = [];
        }
      },
      (error) => {
        console.error('Error fetching published posts:', error);
      }
    );
  }

  openCreateDialog(): void {
    this.dialogService.openCreateDialog();
  }

  openEditDialog(postId: number): void {
    this.dialogService.openEditDialog(postId);
  }
  Create(data: string, postId?: number): void {
    console.log("Creating new");
    if (data === "create") {
      this.router.navigate(['/newPost']);
    } else if (data === "edit" && postId) {
      // Hash the postId before sending it to the route
      const salt = bcrypt.genSaltSync(10); // Generate a salt
      const hashedId = bcrypt.hashSync(postId.toString(), salt); // Hash the postId
      this.router.navigate([`/editPost/${hashedId}`]); // Navigate with the hashed ID
    } else {
      console.error("Invalid operation: Missing post ID for edit.");
    }
  }

  fetchPostsByCategory(cat_id: number): void {
    this.postService.getPostsByCategoryId(cat_id).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.posts = response.data;
        } else {
          console.error('Invalid API response format for category:', response);
          this.posts = [];
        }
      },
      (error) => {
        console.error('Error fetching posts by category:', error);
      }
    );
  }

  addPost(formData: any): void {
    this.postService.AddPost(formData).subscribe({
      next: (response) => {
        console.log('Post added successfully:', response);
        this.fetchPosts();
  
        // Show success notification
        Swal.fire({
          title: 'Success!',
          text: 'Post added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000, // Auto-close after 2 seconds
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error adding post:', error);
  
        // Show error notification
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add post. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2500, // Auto-close after 2.5 seconds
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      },
    });
  }

  Delete(post: any): void {
    console.log("Soft Deleting Post:", post);
    console.log("Post ID:", post.id);
    // if (!post.isPublished) {
    //   Swal.fire({
    //     title: 'Already Deleted!',
    //     text: 'This post is already soft deleted.',
    //     icon: 'info',
    //     confirmButtonColor: '#3085d6',
    //     confirmButtonText: 'OK'
    //   });
    //   return;
    // }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to soft delete this post.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.softDeletePost(post.id).subscribe(
          (response) => {
            console.log("Post soft deleted successfully:", response);
            Swal.fire('Deleted!', 'The post has been soft deleted.', 'success');
            this.ngOnInit();
          },
          (error) => {
            console.error("Error soft deleting post:", error);
            Swal.fire('Error!', 'Failed to delete the post.', 'error');
          }
        );
      }
    });
  }
}