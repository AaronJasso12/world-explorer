import type { Region } from './../../interfaces/region.type';
import { Component, inject, linkedSignal } from '@angular/core';
import { ListComponent } from '../../components/list/list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { Country } from '../../interfaces/contry.interface';

function validateQueryParam(queryParam: string): Region {
  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic',
  };

  return validRegions[queryParam] ?? 'Americas';
}

@Component({
  selector: 'app-by-region-page',
  imports: [ListComponent],
  templateUrl: './byRegionPage.component.html',
})
export class ByRegionPageComponent {
  countrySrv = inject(CountryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? '';

  selectedRegion = linkedSignal<Region>(() => validateQueryParam(this.queryParam));

  countryResource = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if (!params.region) return of([] as Country[]);

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: params.region
        }
      });

      return this.countrySrv.searchByRegion(params.region);
    }
  });
}
