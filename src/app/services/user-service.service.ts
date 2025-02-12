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

    // In your user-service.service.ts
getAllUsers(search: string = '', filter: string = ''): Observable<any> {
  return this.http.get<any>(`${this.url}FetchAllUsers`, {
      params: {
          search: search,
          filter: filter
      }
  });
}


      public AddUser(userData: any): Observable<Users> {
        return this.http.post<Users>(this.url+"CreateUser", userData);  // Send plain object instead of FormGroup
      }
      public GetUserById(id: number): Observable<Users>{
        return this.http.get<Users>(this.url+"GetUserById/"+ id);
    }
    getUserIdByEmail(email: string): Observable<any> {
      return this.http.get(`${this.url}email/${email}`);
    }
    public UpdateUser(id: number, formData: FormGroup): Observable<any> {
      // Use id directly to update the URL dynamically
      return this.http.put<any>(`${this.url}UpdateUser/${id}`, formData);
    }
   // Inside your UserService (user-service.service.ts)
softDeleteUser(id: number): Observable<any> {
  // Send a PUT request to your API with the ID and the updated user data
  const userData = { isDeleted: true };  // Set isActive to false for soft deletion

 return  this.http.put<any>(`${this.url}DeleteUser/${id}`, userData);
  
}

    
}