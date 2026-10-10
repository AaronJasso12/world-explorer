import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import type { RESTCountry } from '../interfaces/rest-contries.interfaces';
import type { Country } from '../interfaces/contry.interface';
import type { Region } from '../interfaces/region.type';
import { CountryMapper } from '../mappers/country.mapper';
import { environment } from '@environments/environment';

const API_URL = environment.apiUrl;
const API_TOKEN = environment.apiToken;

@Service()
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    const headers = {
      'Authorization': `Bearer ${API_TOKEN}`
    };
    const url = `${API_URL}/capitals?q=${query}`;

    return this.http.get<RESTCountry>(url, { headers })
    .pipe(
      map(resp => CountryMapper.mapCountryItemsArrayToCountryArray(resp.data.objects)),
      tap(countries => this.queryCacheCapital.set(query, countries)),
      catchError(error => {
        return throwError(() => new Error(`No se pudo obtener países con ese query: ${query}`))
      })
    );
  }

  searchByCountry(query: string) {
    query = query.toLowerCase();
    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    const headers = {
      'Authorization': `Bearer ${API_TOKEN}`
    };
    const url = `${API_URL}/names.translations?q=${query}`;

    return this.http.get<RESTCountry>(url, { headers })
    .pipe(
      map(resp => CountryMapper.mapCountryItemsArrayToCountryArray(resp.data.objects)),
      tap(countries => this.queryCacheCountry.set(query, countries)),
      delay(2000),
      catchError(error => {
        return throwError(() => new Error(`No se pudo obtener países con ese query: ${query}`))
      })
    );
  }

  searchCountryByAlphaCode(code: string) {
    const headers = {
      'Authorization': `Bearer ${API_TOKEN}`
    };
    const url = `${API_URL}/codes.alpha_2/${code}`;

    return this.http.get<RESTCountry>(url, { headers })
    .pipe(
      map(resp => CountryMapper.mapCountryItemsArrayToCountryArray(resp.data.objects)),
      map(countries => countries.at(0)),
      catchError(error => {
        return throwError(() => new Error(`No se pudo obtener países con ese código: ${code}`))
      })
    );
  }

  searchByRegion(region: Region) {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    const headers = {
      'Authorization': `Bearer ${API_TOKEN}`
    };
    const url = `${API_URL}/region/${region}`;
    console.log(`Llegando al server por ${region}`);

    return this.http.get<RESTCountry>(url, { headers })
    .pipe(
      map(resp => CountryMapper.mapCountryItemsArrayToCountryArray(resp.data.objects)),
      tap(countries => this.queryCacheRegion.set(region, countries)),
      catchError(error => {
        return throwError(() => new Error(`No se pudo obtener países con esa región: ${region} - ${error}`))
      })
    );
  }
}
