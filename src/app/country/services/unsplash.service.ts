import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Unsplash } from '../interfaces/unsplash.interface';
import { RESTUnsplash } from '../interfaces/rest-unsplahs.interfaces';
import { UnSplashMapper } from '../mappers/unsplash.mapper';

const API_URL = environment.apiUrlUnsplash;
const API_KEY = environment.apiKeyUnsplash;

@Service()
export class UnsplashService {
  private http = inject(HttpClient);

  searchByCountry(query: string): Observable<Unsplash[]> {
    query = query.toLowerCase();
    const headers = {
      'Authorization': `Client-ID ${API_KEY}`
    };
    const params = {
      query,
      per_page: 5
    };
    const url = `${API_URL}`;

    return this.http.get<RESTUnsplash>(url, { headers, params })
    .pipe(
      map(resp => UnSplashMapper.mapSplashArrayToUnsplashArray(resp.results)),
      catchError(error => {
        return throwError(() => new Error(`No se encontraron foto con ese query: ${query}`))
      })
    );
  }
}
