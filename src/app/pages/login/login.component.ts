import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/post-models/login-model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/post-models/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginModel: LoginModel = new LoginModel();
  showNotFoundMsg: boolean = false;
  showExceptionMsg: boolean = false;

  constructor(
    private apiService: ApiService,
    public userService: UserService,
    private router: Router
  ) {
   }
  
  submitLogin(){
    this.apiService.login(this.loginModel).subscribe({
      next: (resp:boolean) => {
        if(resp === false){
          this.showNotFoundMsg = true;
        }else{
          this.router.navigate(['/users']);
        }
      },
      error: () => {
        this.showExceptionMsg = true;
      }
    });
  }

  ngOnInit() {
    
  }

}
