import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {  Users  } from "../models/user.model";
import { FormGroup } from "@angular/forms";





@Injectable({
    providedIn: 'root'
  })
  export class UserService 
  {
    [x: string]: any;
    public url = environment.BaseURL+"User/";
    constructor(private http: HttpClient) { }

    public GetAllUsers(): Observable<any> {
        return this.http.get<any>(this.url + "FetchAllUsers"); // Fixed URL
      }


      public AddUser(userData: any): Observable<Users> {
        return this.http.post<Users>(this.url+"CreateUser", userData);  // Send plain object instead of FormGroup
      }
      public GetUserById(id: number): Observable<Users>{
        return this.http.get<Users>(this.url+"GetUserById/"+ id);
    }
    public UpdateUser(id: number, formData: FormGroup): Observable<any> {
      // Use id directly to update the URL dynamically
      return this.http.put<any>(`${this.url}UpdateUser/${id}`, formData);
    }
   // Inside your UserService (user-service.service.ts)
softDeleteUser(id: number): Observable<any> {
  // Send a PUT request to your API with the ID and the updated user data
  const userData = { isActive: false };  // Set isActive to false for soft deletion

 return  this.http.put<any>(`${this.url}DeleteUser/${id}`, userData);
  
}

    
}