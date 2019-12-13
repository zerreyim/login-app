import { Injectable } from '@angular/core';
import { UserModel } from '../post-models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserModel;
  isAuthenticated: boolean = false;
  
  constructor() { }
}
