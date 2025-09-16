import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LoginComponent } from './app/components/login/login';

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));

  bootstrapApplication(LoginComponent, appConfig)
  .catch(err => console.error(err));