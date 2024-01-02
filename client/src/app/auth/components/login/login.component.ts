import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { SocketService } from "src/app/shared/services/socket.service";

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html'
  
})
export class LoginComponent {
  errorMessage: string | null = null
  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private socketService: SocketService
  ) {}

  onSubmit(): void {
    this.authService.login(this.form.value).subscribe({
      next:loggedUser => {
        console.log("loggedUser", loggedUser)
        this.authService.setToken(loggedUser)
        this.authService.setCurrentUser(loggedUser)
        this.socketService.setupSocketConnection(loggedUser)
        this.errorMessage = null
        this.router.navigateByUrl('/')
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error)
        this.errorMessage = err.error.emailOrPassword
      }
    })
  }
}