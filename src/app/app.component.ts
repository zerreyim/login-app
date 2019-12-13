import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'login App';

  constructor(
    private api: ApiService,
    private router: Router
  ){
    this.api.tryAuthentication().subscribe({
      next: (resp: boolean) => {
        if(resp === false)
          this.router.navigate(['/login']);
          else
          this.router.navigate(['/users']);
      },
      error: () => this.router.navigate(['/login'])
    })
  }
}
