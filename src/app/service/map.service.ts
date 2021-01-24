import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MapModel} from '../../model/map';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {
  }

  getMapById(id: string | null): Observable<MapModel> {
    return this.http.get<MapModel>('http://localhost:8080/api/map/' + id).pipe(
      map(l => l),
    );
  }

}
