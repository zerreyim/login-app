import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../post-models/login-model';
import { UserModel } from '../post-models/user-model';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators';
import { UserService } from './user.service';

const apiUrl = "/api/";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private authToken:string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { 
    
  }

    getAllUsers(): Observable<Array<UserModel>>{
      return this.http.get(apiUrl + 'users').pipe(map(
        (usersList: Array<UserModel>) => {
          return usersList.sort((a,b) =>  b.id - a.id);
        }
      ));
    }

    addUser(user: UserModel): Observable<UserModel>{
      return this.http.post(apiUrl + 'users', user).pipe(map((resp: {id: number}) => {
        user.id = resp.id;
        return user;
      }));
    }

    updateUser(user: UserModel): Observable<boolean>{
      return this.http.put(apiUrl + 'users/'+user.id, user).pipe(map(() => {
        return true;
      }));
    }

    deleteUser(user: UserModel): Observable<boolean>{
      return this.http.delete(apiUrl + 'users/'+user.id).pipe(map(() => {
        return true;
      }))
    }

    logoff(){
      localStorage.clear();
      window.location.href = "/";
    }

    login(loginModel: LoginModel): Observable<boolean>{
      let allUsers: Array<UserModel>;
      let user: UserModel;
      return this.http.get(apiUrl + 'users').pipe(map(
        (usersList: Array<UserModel>) => {
          allUsers = usersList;
          user = allUsers.find(u => 
            u.email === loginModel.email && u.password === loginModel.password
            );
          if (user !== undefined) {
            return this.signIn(user);
          }
          return false;
        })
      );
      
    }


    private signIn(user:UserModel): boolean {
      let token = btoa(user.email + ':' + user.password);
      localStorage.setItem('auth-token', token);
      this.authToken = token;

      this.userService.user = user;
      this.userService.isAuthenticated = true;
      return true;
    }

    tryAuthentication(): Observable<boolean>{
      let token = localStorage.getItem('auth-token');
      if(token !== undefined){
        let parsedToken = atob(token).split(':');
        let loginModel = new LoginModel();
        loginModel.email = parsedToken[0];
        loginModel.password = parsedToken[1];
        return this.login(loginModel);

      }
      return of(false);
    }

    checkEmailUsage(email: string, id: number): Observable<boolean>{
      return this.getAllUsers().pipe(map((users) => {
        return users.filter(u => u.email === email && u.id !== id).length > 0;
      }));
    }

    checkUsernameUsage(username: string, id: number): Observable<boolean>{
      return this.getAllUsers().pipe(map((users) => {
        return users.filter(u => u.username === username && u.id !== id).length > 0;
      }));
    }

}
