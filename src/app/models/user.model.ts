// Adjusted interfaces based on API response structure
export interface AddUserResponse {
    result: AddUser;  // Assuming the response has only one user object for creation
    statusCode: number;
    errorMessage: string;
  }
  
  export interface AddUser {
    name: string;
    email: string;
    phone: string;
    password: string;
    IsActive: boolean;  // Ensure the casing matches (isActive, not isactive)
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    IsActive: boolean;
    createdAt: string;
  }
  
  export interface Users {
    result: User[];  // List of users
    statusCode: number;
    errorMessage: string;
  }
  