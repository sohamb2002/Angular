import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { Users } from '../../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule] ,
  providers: [UserService]
   // Import ReactiveFormsModule here
})
export class CreateUserComponent implements OnInit {

  createUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: [true]
    });
  }

  onSubmit() {
    if (this.createUserForm.invalid) {
      return;
    }

    // Send form values to the service
    this.userService.AddUser(this.createUserForm.value).subscribe(
      (response: Users) => {
        console.log('User created successfully', response);
        this.router.navigate(['/User']); // Redirect after successful user creation
      },
      (error) => {
        console.error('Error creating user', error);
      }
    );
  }

  get f() {
    return this.createUserForm.controls;
  }
}
