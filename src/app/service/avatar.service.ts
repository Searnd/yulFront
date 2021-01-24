import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avatar } from 'src/model/avatar';
import { ServerInfo } from '../server-info';

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

  getAvatarById(id: string): Observable<Avatar> {
    return this.http.get<Avatar>(ServerInfo.baseUrl + '/api/avatar/' + id).pipe(
      map(Avatar => Avatar),
    );
  }

  getAvatarByType(type: number): Observable<Avatar> {
    return this.http.get<Avatar>(ServerInfo.baseUrl + '/api/avatar/type/'+ type).pipe(
      map(Avatar => Avatar),
    );
  }

  moveAvatars(avatars: Avatar[]): Observable<void> {
    return this.http.post<void>(ServerInfo.baseUrl + '/api/avatar/move-avatars/', avatars);
  }

  resetAvatars(): Observable<void> {
    return this.http.put<void>(ServerInfo.baseUrl + '/api/avatar/reset-avatars/', {});
  }
}
