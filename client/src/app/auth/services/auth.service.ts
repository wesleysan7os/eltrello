import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, filter, map } from "rxjs";
import { CurrentUserInterface } from "../types/currentUser.interface";
import { environment } from "src/environments/environment";
import { RegisterRequestInterface } from "../types/registerRequest.interface";
import { LoginRequestInterface } from "../types/loginRequest.interface";

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined)
  isLogged$ = this.currentUser$.pipe(
    filter(currentUser => currentUser !== undefined),
    map(currentUser => Boolean(currentUser))
  )

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/user'
    return this.http.get<CurrentUserInterface>(url)
  }

  register(registerRequest: RegisterRequestInterface): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users'
    return this.http.post<CurrentUserInterface>(url, registerRequest)
  }

  login(loginRequest: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users/login'
    return this.http.post<CurrentUserInterface>(url, loginRequest)
  }

  setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token)
  } 

  setCurrentUser(user: CurrentUserInterface | null): void {
    this.currentUser$.next(user)
  }

  logout(): void {
    localStorage.removeItem('token')
    this.currentUser$.next(null)
  }
}