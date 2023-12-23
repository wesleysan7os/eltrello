import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { CurrentUserInterface } from "../types/currentUser.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined)

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/user'
    return this.http.get<CurrentUserInterface>(url)
  }

  setCurrentUser(user: CurrentUserInterface | null): void {
    this.currentUser$.next(user)
  }
}