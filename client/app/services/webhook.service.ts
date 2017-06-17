import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WebhookService {

  private headers = new Headers({ 'Content-Type': 'appliwebhookion/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getWebhooks(): Observable<any> {
    return this.http.get('/api/cats').map(res => res.json());
  }

  countWebhooks(): Observable<any> {
    return this.http.get('/api/cats/count').map(res => res.json());
  }

  addWebhook(webhook): Observable<any> {
    return this.http.post('/api/cat', JSON.stringify(webhook), this.options);
  }

  getWebhook(webhook): Observable<any> {
    return this.http.get(`/api/cat/${webhook._id}`).map(res => res.json());
  }

  editWebhook(webhook): Observable<any> {
    return this.http.put(`/api/cat/${webhook._id}`, JSON.stringify(webhook), this.options);
  }

  deleteWebhook(webhook): Observable<any> {
    return this.http.delete(`/api/cat/${webhook._id}`, this.options);
  }

}
