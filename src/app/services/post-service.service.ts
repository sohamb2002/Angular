import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import {  Users } from "../models/user.model";
import { FormGroup } from "@angular/forms";
import { AllPost, AllPosts, Posts } from "../models/post";





@Injectable({
    providedIn: 'root'
  })
  export class PostService 
  {
    public url = environment.BaseURL+"Post/";
    constructor(private http: HttpClient) { }

    public getAllPosts(): Observable<any>{
        return this.http.get<any>(this.url+"FetchAllPosts");

    }
    public GetAllPublishedPosts(): Observable<any> {
      return this.http.get<any>(this.url + "fetchPublishedPosts" );
    }
    
//   public  AddPost(formdata: FormGroup): Observable<any>{
//     return this.http.post<any>(this.url+"CreatePost", formdata);
// }
// public  GetById(id:number): Observable<any>{
//   return this.http.get<any>(this.url+"A");
// }
getPostById(id: number): Observable<any> {
  return this.http.get<any>(`${this.url}FetchOnePost/${id}`);
}


// UpdatePost(id: number, post: any): Observable<any> {
//   return this.http.put<any>(`${this.url}EditPost/${id}`, post);
// }
softDeletePost(id: number): Observable<any> {

  const postData = { isDeleted: true };  //

 return  this.http.put<any>(`${this.url}DeletePost/${id}`, postData);
  
}
public AddPost(formdata: any): Observable<any> {
  const currentTimestamp = new Date().toISOString().split('Z')[0]; // Remove 'Z' to avoid timezone
  const newPost = {
    ...formdata,
    category: Number(formdata.category), // Convert category to number
    createdDate: currentTimestamp, // Assign created time without timezone
    updatedAt: currentTimestamp,   // Assign update time initially without timezone
  };

  console.log("New Post Payload:", newPost);

  return this.http.post<any>(`${this.url}CreatePost`, newPost).pipe(
    tap((response: any) => console.log("API Response:", response)) // Log the actual response
  );
}




public UpdatePost(id: number, post: any): Observable<any> {
  const updatedPost = {
    ...post,
    updatedAt: new Date().toISOString(), // Update time when edited
  };

  return this.http.put<any>(`${this.url}EditPost/${id}`, updatedPost);
}

  getPostsByCategoryId(cat_id: number): Observable<any> {
    return this.http.get<any>(`${this.url}FetchPost/${cat_id}`);
  }
}


  