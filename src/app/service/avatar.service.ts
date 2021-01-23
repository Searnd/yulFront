import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avatar } from 'src/model/avatar';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private http: HttpClient) { }

  getAvatars(): Observable<Avatar[]> {
    return this.http.get<Avatar[]>('http://localhost:8080/api/avatar/').pipe(
      map(a => a)
    )
  }
}
