import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user.model';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule, HttpClientModule, ButtonModule,FormsModule,TagModule],
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})    
export class UserComponent implements OnInit {

  user: any[] = []; // All users
  filteredUsers: any[] = []; // Users to display after filtering
  showAllUsers: boolean = true; // Toggle between all users and active users
  showInactiveUsers: boolean = false; // Toggle to show inactive users only
  searchText: string = ''; // Search bar input

  currentFilter: string = '';

  constructor(public userService: UserService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchData();
  }

  // fetchData() {
  //   this.userService.GetAllUsers().subscribe((data) => {
  //     if (data && data.data) {
  //       this.user = data.data
  //         .filter((user: any) => !user.isDeleted)
  //         .sort((a: { id: number }, b: { id: number }) => a.id - b.id);
  //       this.applyFilters(); // Apply filters after fetching data
  //     } else {
  //       console.error("Invalid API response:", data);
  //     }
  //   }, (error) => {
  //     console.error("Error fetching users:", error);
  //   });
  // }

  // applyFilters() {
  //   if (this.showInactiveUsers) {
  //     this.filteredUsers = this.user.filter(user => !user.isActive);
  //   } else if (this.showAllUsers) {
  //     this.filteredUsers = this.user;
  //   } else {
  //     this.filteredUsers = this.user.filter(user => user.isActive);
  //   }

  //   // Filter by search text
  //   if (this.searchText) {
  //     this.filteredUsers = this.filteredUsers.filter(user =>
  //       user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
  //       user.email.toLowerCase().includes(this.searchText.toLowerCase())
  //     );
  //   }
  // }

  // toggleUserView(viewType: string) {
  //   if (viewType === 'all') {
  //     this.showAllUsers = true;
  //     this.showInactiveUsers = false;
  //   } else if (viewType === 'active') {
  //     this.showAllUsers = false;
  //     this.showInactiveUsers = false;
  //   } else if (viewType === 'inactive') {
  //     this.showAllUsers = false;
  //     this.showInactiveUsers = true;
  //   }
  //   this.applyFilters();
  // }



 

  fetchData() {
    this.userService.getAllUsers(this.searchText, this.currentFilter).subscribe({
      next: (data) => {
        if (data && data.data) {
          this.user = data.data.filter((user: { isDeleted: any; }) => !user.isDeleted); // Filter out deleted users
          this.filteredUsers = this.user;
        } else {
          console.error("Invalid API response:", data);
        }
      },
      error: (error) => {
        console.error("Error fetching users:", error);
      }
    });
  }
  

  onSearch() {
    this.fetchData();
  }

  toggleUserView(viewType: string) {
    switch (viewType) {
      case 'all':
        this.currentFilter = '';
        break;
      case 'active':
        this.currentFilter = 'a';
        break;
      case 'inactive':
        this.currentFilter = 'i';
        break;
    }
    this.fetchData();
  }

  // onSearch() {
  //   this.applyFilters();
  // }

  onEdit(user: User): void {
    const encodedId = btoa(user.id.toString());
    this.router.navigate([`/editUser/${encodedId}`]);
  }

  onDelete(user: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to soft delete this user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.softDeleteUser(user.id).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'The user has been soft deleted.', 'success');
            this.fetchData(); // Refresh the user list
          },
          (error) => {
            Swal.fire('Error!', 'Failed to delete the user.', 'error');
          }
        );
      }
    });
  }
}