import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {PrettyJsonComponent} from 'angular2-prettyjson';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { EventService } from '../services/event.service';
import { WebhookService } from '../services/webhook.service';
import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  entryComponents: [PrettyJsonComponent]
})
export class EventsComponent implements OnInit {

  event = {};
  events = [];

  webhook_id = "";
  webhook = {};
  webhooks = [];

  isLoading = true;

  constructor(private auth: AuthService,
              private eventService: EventService,
              private webhookService: WebhookService,
              private formBuilder: FormBuilder,
              private http: Http,
              private route: ActivatedRoute,
              private router: Router,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.event = {};
    this.events = [];
    this.getWebhooks();
    this.route.params.subscribe(params => {
      this.webhook_id = params['webhook'];
      console.log(this.webhook_id);
      if (this.webhook_id) {
        this.getEventsInWebhook();
      } else {
        this.getEvents();
      }
    })
  }

  getWebhooks() {
    this.webhookService.getWebhooks().subscribe(
      data => this.webhooks = data,
      error => console.log(error),
      () => {
        const pos = this.webhooks.map(elem => elem._id).indexOf(this.webhook_id); 
        if (pos >= 0)
          this.webhook = this.webhooks[pos];
        else
          this.webhook = "All";
      },
    );
  }
  getEvents() {
    this.eventService.getEvents().subscribe(
      data => this.events = data,
      error => console.log(error),
      () => {this.isLoading = false; this.event = this.events[0];}
    );
  }

  getEventsInWebhook() {
    this.eventService.getEventsInWebhook(this.webhook_id).subscribe(
      data => this.events = data,
      error => console.log(error),
      () => {this.isLoading = false; this.event = this.events[0];}
    );
  }

  deleteEvent(event) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.eventService.deleteEvent(event).subscribe(
        res => {
          const pos = this.events.map(elem => elem._id).indexOf(event._id);
          this.events.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  onSelectEvent(event) {
    this.event = event;
  }

  onWebhookChange(selected) {
    this.webhook = selected;
    if (this.webhook == "All") {
      this.router.navigateByUrl("/events");
    } else {
      this.router.navigateByUrl("/events/" + selected._id);
    }
  }

}
