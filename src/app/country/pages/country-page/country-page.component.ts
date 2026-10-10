import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { CountryInformationComponent } from './country-information/country-information.component';
import { UnsplashService } from '../../services/unsplash.service';

@Component({
  selector: 'app-country-page.component',
  imports: [NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  countrySrv = inject(CountryService);
  unsplashSrv = inject(UnsplashService);

  countryCode = inject(ActivatedRoute).snapshot.params['code'];

  countryResource = rxResource({
    params: () => ({ code: this.countryCode }),
    stream: ({ params }) => {
      return this.countrySrv.searchCountryByAlphaCode(params.code);
    },
  });

  unsplashResource = rxResource({
    params: () => ({ name: this.countryResource.value()?.name ?? null }),
    stream: ({ params }) => {
      if (!params.name) return of([]);
      return this.unsplashSrv.searchByCountry(params.name);
    }
  });
}
