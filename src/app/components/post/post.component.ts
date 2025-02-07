import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post-service.service';
import { Post } from '../../models/post';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
//import { CreatePostDialogueComponent } from '../../components/create-post-dialogue/create-post-dialogue.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CardModule, ButtonModule, ReactiveFormsModule, CommonModule],
  providers: [DialogService],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  postForm!: FormGroup;
  visible: boolean = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  // Fetch all posts from the service
  fetchPosts(): void {
    console.log('fetching posts');
    this.postService.getAllPosts().subscribe(
      (response) => {
        console.log('API Response:', response);
        if (response && Array.isArray(response.data)) {
          this.posts = response.data;
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
  handleFormSubmit(formData: any) {
    console.log('Form Data:', formData);
    // Handle the form data (e.g., save it, send it to a service, etc.)
  }
  // Fetch published posts from the service
  fetchPublishedPosts(): void {
    console.log('fetching published posts');
    this.postService.GetAllPublishedPosts().subscribe(
      (response) => {
        console.log('All published posts:', response);
        if (response && Array.isArray(response.data)) {
          this.posts = response.data; // Update posts with published posts
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
  Create(data: string, postId?: number): void {
    console.log("Creating new");
  
    if (data === "create") {
      this.router.navigate(['/newPost']);
    } else if (data === "edit" && postId) {
      this.router.navigate([`/editPost/${postId}`]);
    } else {
      console.error("Invalid operation: Missing post ID for edit.");
    }
  }
  
    

  // Call the AddPost API
  addPost(formData: any): void {
    this.postService.AddPost(formData).subscribe({
      next: (response) => {
        console.log('Post added successfully:', response);
        this.fetchPosts(); // Refresh the posts list
      },
      error: (error) => {
        console.error('Error adding post:', error);
      },
    });
  }

  // Handle post edit
  // onEdit(post: Post): void {
  //   console.log('Editing post:', post);
  //   this.router.navigate(['/edit', post.id]);
  // }
  Delete(post: any): void {
    console.log("Soft Deleting Post:", post);
    console.log("Post ID:", post.id);

    if (!post.isPublished) {
        alert("This post is already soft deleted.");
        return;
    }

    const confirmDelete = window.confirm("Are you sure you want to soft delete this post?");

    if (confirmDelete) {
        this.postService.softDeletePost(post.id).subscribe(
            (response) => {
                console.log("Post soft deleted successfully:", response);

                // Reload the post list to reflect changes
                this.ngOnInit();

                console.log("After soft delete");
            },
            (error) => {
                console.error("Error soft deleting post:", error);
            }
        );
    }
}

}