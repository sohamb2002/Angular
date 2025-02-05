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
      
}