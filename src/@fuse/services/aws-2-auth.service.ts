import { Injectable } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
    MatSnackBar, MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material';


@Injectable({
    providedIn: 'root'
})

export class AuthService2 {

    awsConfirm: any;
    code: any;
    awsUser: any;
    firstUser: any;
    awsUserName: string;
    currentUser: Observable<any>;
    signedIn: any;
    currentUserSnapshot: any;
    forgotPasswordUsername: string;
    totpCode: string;
    userForTotp: any;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    currentMfaType: string;

    constructor(private amplifyService: AmplifyService,
        public snackBar: MatSnackBar,
        private router: Router) {
    }

    storeUserName(username: string): void {
        this.awsUserName = username;
    }

    newLoginUser(username: string, password: string): void {
        // this.amplifyService.auth().configure({
        //     authenticationFlowType: 'USER_SRP_AUTH'
        // });
        this.awsUserName = username;
        this.amplifyService.auth().signIn(username, password)
            .then(user => {
                this.firstUser = user; 
                this.amplifyService.auth().currentAuthenticatedUser()
                .then(data => {
                    this.awsUser = data;
                    console.log(this.awsUser);
                    this.otherLogic();
                })
                .catch(err => console.log(err));       
                this.amplifyService.auth().getPreferredMFA(user).then((data) => {
                    console.log('Current prefered MFA type is: ' + data);
                    this.currentMfaType = data;
                });
                

               
            })
            .catch(err => console.log(err));
            


    }

    otherLogic(): void {
        
      console.log(this.awsUser.attributes);
      console.log(this.awsUser.attributes['custom:userRole']);
        if (this.awsUser.attributes['custom:userRole'] === 'admin') {
            this.amplifyService.auth().setPreferredMFA(this.firstUser, 'TOTP').then((data) => {
                console.log(data);
                this.router.navigate(['pages/auth/totp']);
                this.snackBar.open('Please authenticate with MFA', 'close', {
                    duration: 2000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition
                });
            }).catch(e => { console.log(e); });
        } else {
            this.amplifyService.auth().configure({
                authenticationFlowType: 'CUSTOM_AUTH'
            });
            this.amplifyService.auth().setPreferredMFA(this.firstUser, 'NOMFA').then((data) => {
                this.router.navigate(['pages/auth/challenge']);


            }).catch();

        }
    }

    sendChallenge(challengeResponse: string): void {
    
        this.amplifyService.auth().sendCustomChallengeAnswer(this.firstUser, challengeResponse)
            // tslint:disable-next-line:no-shadowed-variable
            .then(user => console.log(user))
            .catch(err => console.log(err));

    }
}

