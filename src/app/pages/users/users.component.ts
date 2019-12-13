import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/post-models/user-model';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { FormStatuses } from './form-statuses.enum';
import { map, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  editingUser: UserModel;
  editingUserIdx: number;
  usersList: Observable<Array<UserModel>>;

  constructor(
    private api: ApiService
  ) { }

  updateList(data){
    let status = data.status;

      if(status === FormStatuses.deleted){
        this.api.deleteUser(this.editingUser).subscribe((resp) => {
          if(resp === true){
            this.getUsers();
            this.editingUser = undefined;
          }
          
        })
      }        
        else if(status === FormStatuses.canceled)
          this.editingUser = undefined;

          else if(status === FormStatuses.saved){
            if(this.editingUser.id !== undefined){
              this.api.updateUser(data.user).subscribe(() => {
                this.editingUser = undefined;
                this.getUsers()
              });
              
            }else{
              this.api.addUser(data.user).subscribe(
                () => {
                  this.editingUser = undefined;
                  this.getUsers();
                }
              );
              
            }
          }
  }

  setEditingUser(_user, i){
    if(i === undefined)
      this.editingUser = new UserModel();
    else{
      this.editingUser = _user;
      this.editingUserIdx = i;
    }
    
  }

private generateId(): Observable<number>{
  return this.usersList.pipe(map((list) => {
    return list.sort((a, b) => a.id - b.id)[list.length - 1].id + 1;
  }));
}

getUsers(){
  this.usersList = this.api.getAllUsers();
}

  ngOnInit() {
    this.getUsers();
  }

}
