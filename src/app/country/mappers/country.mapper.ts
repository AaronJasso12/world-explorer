import type { CountryItems } from '../interfaces/rest-contries.interfaces';
import type { Country } from "../interfaces/contry.interface";

export class CountryMapper {
  static mapRestCountryToCountry(countryItem: CountryItems): Country {
    return {
      uuid: countryItem.codes.alpha_2,
      flagIcon: countryItem.flag.emoji,
      flagSvg: countryItem.flag.url_svg,
      name: countryItem.names.translations['spa']?.common ?? 'No Spanish Name',
      capital: countryItem.capitals
        .map(capital => capital.name)
        .join(', ') || 'Sin capital',
      population: countryItem.population,

      nameOficial: countryItem.names.translations['spa']?.official,
      region: countryItem.region,
      subRegion: countryItem.subregion,
      area: countryItem.area.kilometers,
      descripcion: countryItem.descriptions.long,
      idioma: countryItem.languages[0]?.native_name ?? 'No disponible',
      link: countryItem.links.google_maps,
    };
  }

  static mapCountryItemsArrayToCountryArray(countryItems: CountryItems[]): Country[] {
    return countryItems.map(item => this.mapRestCountryToCountry(item));
  }
}
