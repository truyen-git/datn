// built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import {ReactiveFormsModule} from '@angular/forms';
// components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SignUpComponent } from './components/user/signup/signup.component';
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { SignInComponent } from './components/user/signin/signin.component';
//routes
import { appRoutes } from './routes';

import { UserService } from './shared/user.service';
import { UserfbService } from './shared/userfb.service';
//other
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BodyComponent } from './components/body/body.component';
import { UserComponent } from './components/user/user.component';
import { RequestResetComponent } from './components/user/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/user/response-reset/response-reset.component';

export function getAuthHttp(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-auth-token',
    noTokenScheme: true,
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('id_token')),
  }), http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignUpComponent,
    UserProfileComponent,
    SignInComponent,
    BodyComponent,
    UserComponent,
    RequestResetComponent,
    ResponseResetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },AuthGuard,UserService, UserfbService,
  {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
