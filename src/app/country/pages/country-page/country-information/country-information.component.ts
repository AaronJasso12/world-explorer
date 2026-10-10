import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import type { Country } from '../../../interfaces/contry.interface';
import type { Unsplash } from '../../../interfaces/unsplash.interface';

@Component({
  selector: 'country-information-page',
  imports: [DecimalPipe],
  templateUrl: './country-information.component.html',
})
export class CountryInformationComponent {
  country = input.required<Country>();
  imgsUrl = input.required<Unsplash[]>();
  currentImgIndex = signal(0);

  currentImg = computed(() => {
    return this.imgsUrl()?.[this.currentImgIndex()] ?? null
  });

  nextImg(): void {
    const total = this.imgsUrl().length;

    if (total <= 1) return;

    this.currentImgIndex.update(index => (index + 1) % total);
  }

  previousImg(): void {
    const total = this.imgsUrl().length;

    if (total <= 1) return;

    this.currentImgIndex.update(index => (index - 1 + total) % total);
  }
}
