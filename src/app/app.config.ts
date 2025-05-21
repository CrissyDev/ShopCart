import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { ApplicationConfig } from '@angular/core';

export function playerFactory() {
  return player;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({ player: playerFactory }),
    
  ]
};
