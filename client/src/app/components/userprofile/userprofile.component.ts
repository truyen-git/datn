import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { UserfbService } from '../../shared/userfb.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserProfileComponent implements OnInit {
  public userDetails;
  public currentUser : any = {};
  constructor(private userService: UserService, private userfbService: UserfbService, private router: Router) { }

  ngOnInit() {
    
      this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
      },
      err => { 
        console.log(err);
        
      }
    );
    this.userfbService.getCurrentUser().then(profile => this.currentUser = profile)
        .catch(() => this.currentUser = {});
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/header']);
  }

}
