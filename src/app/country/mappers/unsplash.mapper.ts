import { Splash } from "../interfaces/rest-unsplahs.interfaces";
import { Unsplash } from "../interfaces/unsplash.interface";

export class UnSplashMapper {
  static mapRestUnsplashToSplash(splashItem: Splash): Unsplash {
    return {
      uuid: splashItem.id,
      urlImg: splashItem.urls.regular,
      descripcion: splashItem.description,
      autor: splashItem.user.name,
      autorUrl: splashItem.user.links.html,
      urlOficial: splashItem.links.html,
    };
  }

  static mapSplashArrayToUnsplashArray(splashItem: Splash[]): Unsplash[] {
    return splashItem.map(item => this.mapRestUnsplashToSplash(item));
  }
}
