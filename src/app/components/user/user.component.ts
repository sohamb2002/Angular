import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule,CommonModule,HttpClientModule,TableModule],
  providers: [UserService],

  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'] // Fixed property name
})
export class UserComponent implements OnInit {

  user: User[] = []; // Declare the user property

  constructor(public userService: UserService) {}

  ngOnInit() {
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
  
}
