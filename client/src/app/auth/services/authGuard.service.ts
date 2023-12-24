import { CanActivate, Router } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLogged$.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }

        this.router.navigateByUrl('/')
        return false;
      })
    )
  }
}