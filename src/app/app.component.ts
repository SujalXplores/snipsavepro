import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Snip Save';
  constructor() {
    this.clearCache();
  }

  clearCache() {
    if ('caches' in window) {
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          return caches.delete(key);
        }));
      });
    }
  }
}
