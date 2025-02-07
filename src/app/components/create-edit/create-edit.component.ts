import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post-service.service';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CreateEditComponent implements OnInit {
  postForm!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  postId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isPublished: [false]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.postId = id ? +id : null;
      this.mode = this.postId ? 'edit' : 'create';

      if (this.mode === 'edit') {
        this.loadPostForEdit();
      }
    });
  }

  loadPostForEdit(): void {
    if (this.postId !== null) {
      this.postService.getPostById(this.postId).subscribe(post => {
        console.log('Fetched Post:', post); // Verify data
        if (!post || typeof post !== 'object') {
          console.error('Invalid post data');
          return;
        }
  
        // Patch values carefully
        this.postForm.patchValue({
          title: post.title || '',
          description: post.description || '',
          isPublished: post.isPublished ?? false
        });
      });
    }
  }
  

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const formData = this.postForm.value;

    if (this.mode === 'create') {
      this.postService.AddPost(formData).subscribe({
        next: () => {
          console.log('Post created successfully');
          this.router.navigate(['/Posts']);
        },
        error: error => console.error('Error creating post:', error)
      });
    } else if (this.postId !== null) {
      this.postService.UpdatePost(this.postId, formData).subscribe({
        next: () => {
          console.log('Post updated successfully');
          this.router.navigate(['/Posts']);
        },
        error: error => console.error('Error updating post:', error)
      });
    }
  }
}
