import '@angular/localize/init';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideLottieOptions({ player: () => player })
  ]
}).catch((err) => console.error(err));
