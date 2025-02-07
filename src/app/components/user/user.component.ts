import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { TableModule} from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user.model';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule, HttpClientModule,ButtonModule],
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: User[] = []; // Declare the user property

  constructor(public userService: UserService,private router: Router,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("wjrfbwoeif");
    
    this.fetchData();
    
  }

  fetchData() {
    this.userService.GetAllUsers().subscribe((data) => {
      console.log("onInit");
      console.log(data); // Check response structure in console

      if (data && data.data) { // Ensure data is available
        this.user = data.data.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
      } else {
        console.error("Invalid API response:", data);
      }
    }, (error) => {
      console.error("Error fetching users:", error);
    });
  }
  onEdit(user: User): void {
    console.log("Edit User:", user);  // Logs user details
    console.log("User ID:", user.id);  // Ensure this prints a valid ID
    this.router.navigate([`/editUser/${user.id}`]);  // Redirects to the edit page with the user ID in the route
  }
  onDelete(user: User): void {
    console.log("Soft Deleting User:", user);
    console.log("User ID:", user.id);
    
    const confirmDelete = window.confirm("Are you sure you want to soft delete this user?");
    
    if (confirmDelete) {
      this.userService.softDeleteUser(user.id).subscribe(
        (response) => {
          console.log("User soft deleted successfully:", response);
          
          // Trigger change detection manually to update the view
        //   this.cdr.detectChanges();
        //  this.router.navigate(['/User']);
        this.ngOnInit();
          console.log("after soft delete");
          
          
        },
        (error) => {
          console.error("Error soft deleting user:", error);
        }
      );
    }
  }
  
  
  
}