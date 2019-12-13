import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from 'src/app/post-models/user-model';
import {FormStatuses} from "../form-statuses.enum";
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  @Input() user: UserModel;
  @Output() statusChange = new EventEmitter<{status: FormStatuses, user: UserModel}>();

  userModel: UserModel; // this is for form, it is used for copy of userInput

  usernameCheckTimer: any;
  emailCheckTimer: any;

  emailInUse = false;
  usernameInUse = false;

  constructor(
    private api: ApiService
  ) { 
    
  }

cancel(){
  this.statusChange.emit({
    status: FormStatuses.canceled,
    user: new UserModel()
  });
}

delUser(){
  this.statusChange.emit({
    status: FormStatuses.deleted,
    user: new UserModel()
  });
}

submitUser(){
  if(!this.emailInUse && !this.usernameInUse)
    this.statusChange.emit({
      status: FormStatuses.saved,
      user: this.userModel
    });
}

checkEmailInUse(){
  clearTimeout(this.emailCheckTimer);
  this.emailCheckTimer = setTimeout(() => {
    this.api.checkEmailUsage(this.userModel.email, this.user.id).subscribe((resp) => this.emailInUse = resp);
  },100);
}

checkUsernameInUse(){
  clearTimeout(this.usernameCheckTimer);
  this.usernameCheckTimer = setTimeout(() => {
    this.api.checkUsernameUsage(this.userModel.username, this.user.id).subscribe((resp) => this.usernameInUse = resp);
  },100);
}

  ngOnInit() {
    this.userModel = JSON.parse(JSON.stringify(this.user));
  }


}
