import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { IUser } from './models/user';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  public isLogged: Boolean = null;
  public userData: IUser = null

  constructor(private storage: StorageService, private http: HttpClient) {
    this.isLogged = this.storage.getItem('isLogged');
    this.userData = this.userDataSetter();
  }

  userDataSetter (): IUser {
    if(!!this.storage.getItem("userData") === false) {
      const userId = Date.now().toString();
      this.storage.setItem("userData", { id: userId, firstName: "Anonymous" });
    }
    return this.storage.getItem("userData");
  }

  register(userData): Observable<any> {
    return this.http.post(`/users/register`, userData)
      .pipe(tap({ next: (data) => this.reset(data) }));
  }

  login(userData): Observable<any> {
    return this.http.post(`/users/login`, userData)
      .pipe(tap({ next: (data) => this.reset(data) }));
  }

  logout(): Observable<any> {
    return this.http.get(`/users/logout`)
      .pipe(tap({ next: () => this.reset() }));
  }

  updateProfile(updatedData): Observable<any> {
    return this.http.put(`/users/profile`, updatedData)
      .pipe(tap({ next: (data) => this.reset(data) }));
  }

  reset(data = undefined): void {
    if (data) {
      this.storage.setItem("isLogged", true);
      this.storage.setItem("userData", data);
    } else {
      this.storage.setItem('isLogged', null);
      this.storage.setItem('userData', {id: Date.now(), firstName: "Anonymous"});
    }
    this.isLogged = this.storage.getItem('isLogged');
    this.userData = this.storage.getItem('userData');
  }
}