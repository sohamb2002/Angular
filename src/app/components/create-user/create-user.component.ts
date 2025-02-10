import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { Users } from '../../models/user.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-create-user',
  standalone: true,
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    DynamicDialogModule
  ],
  providers: [UserService]
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
   i:number=0;
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
  
    // Ensure the form starts as blank
    console.log('Form before reset:', this.createUserForm.value);
    this.createUserForm.reset();
    console.log('Form after reset:', this.createUserForm.value);
  }
  

  onSubmit() {
    if (this.createUserForm.invalid) {
      return;
    }

    this.userService.AddUser(this.createUserForm.value).subscribe(
      (response: Users) => {
        console.log('User created successfully', response);
        this.router.navigate(['/User']);
      },
      (error) => {
        console.error('Error creating user', error);
      }
    );
  }

  get f() {
    return this.createUserForm.controls;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {

   this.i++;
   console.log(this.i);
   
if(this.i>=10)
{
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
    
    
  }
}
