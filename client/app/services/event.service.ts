import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class EventService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers, withCredentials: true });

  constructor(private http: Http,
              private auth: AuthService) { }

  getEvents(): Observable<any> {
    return this.http.get(`/api/events/${this.auth.currentUser._id}`).map(res => res.json());
  }

  getEventsInWebhook(webhook_id): Observable<any> {
    return this.http.get(`/api/events/${this.auth.currentUser._id}/${webhook_id}`).map(res => res.json());
  }

  getEvent(webhook_id, event_id): Observable<any> {
    return this.http.get(`/api/event/${this.auth.currentUser._id}/${webhook_id}/${event_id}`).map(res => res.json());
  }

  deleteEvent(event): Observable<any> {
    return this.http.delete(`/api/event/${this.auth.currentUser._id}/${event._id}`, this.options);
  }

}
