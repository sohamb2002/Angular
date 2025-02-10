import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { Users } from '../../models/user.model';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers: [UserService],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxModule,
    CommonModule,
    TableModule,
    MessageModule,
    HttpClientModule,
    MessagesModule,
    PasswordModule,
    ButtonModule,
  ],
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form
   
      this.editUserForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Example 10-digit phone validation
        password: ['', [Validators.required, Validators.minLength(6)]],
        isActive: [false, Validators.required], // Initialize to false, make it required
    });


    // Get the user ID from the route parameters
    this.route.paramMap.subscribe((params) => {
      this.userId = +params.get('id')!; // Convert the ID to a number
      this.loadUserData(this.userId); // Fetch the user data based on the ID
    });
  }

  loadUserData(id: number): void {
    this.userService.GetUserById(id).subscribe(
      (response: any) => {
        console.log('User data:', response); // Check the actual response
  
      
  
        const user = response.data;
  
       
        this.editUserForm.setValue({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          password: '',  
          isActive: user.isActive ?? false 
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  

  onSubmit(): void {
    if (this.editUserForm.valid) {
      console.log('Form value:', this.editUserForm.value);
      // Call your service to update the user
      this.userService.UpdateUser(this.userId, this.editUserForm.value).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.router.navigate(['/User']); // Redirect to the user list after update
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}