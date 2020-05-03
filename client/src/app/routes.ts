import { Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { SignUpComponent } from './components/user/signup/signup.component';
import { SignInComponent } from './components/user/signin/signin.component';
import { ResponseResetComponent } from './components/user/response-reset/response-reset.component';
import { RequestResetComponent } from './components/user/request-reset/request-reset.component';
import { UserComponent } from './components/user/user.component';
import { UserProfileComponent } from './components/userprofile/userprofile.component';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: 'header', component: HeaderComponent
    },
    {
        path: 'body', component: BodyComponent
    },
    {
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
    },
    {
        path: 'request-reset-password', component: UserComponent,
        children: [{ path: '', component: RequestResetComponent }]
    },
    {
        path: 'response-reset-password/:token', component: UserComponent,
        children: [{ path: '', component: ResponseResetComponent }]
    },
    {
        path: 'userprofile', component: UserProfileComponent,canActivate:[AuthGuard]
    },
    {
        path: '', redirectTo: '/body', pathMatch: 'full'
    }
];