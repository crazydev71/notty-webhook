import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {RouterLink} from '@angular/router';

import { WebhookService } from '../services/webhook.service';
import { AuthService } from '../services/auth.service'
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-webhooks',
  templateUrl: './webhooks.component.html',
  styleUrls: ['./webhooks.component.scss']
})
export class WebhooksComponent implements OnInit {

  webhook = {};
  webhooks = [];
  isLoading = true;
  isEditing = false;

  addWebhookForm: FormGroup;

  name = new FormControl('', Validators.required);
  description = new FormControl('');
  url = new FormControl('');

  constructor(private auth: AuthService,
              private webhookService: WebhookService,
              private formBuilder: FormBuilder,
              private http: Http,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getWebhooks();
    this.addWebhookForm = this.formBuilder.group({
      name: this.name,
      description: this.description
    });
  }

  getWebhooks() {
    this.webhookService.getWebhooks().subscribe(
      data => this.webhooks = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addWebhook() {
    this.webhookService.addWebhook(this.addWebhookForm.value).subscribe(
      res => {
        const newWebhook = res.json();
        this.webhooks.push(newWebhook);
        this.addWebhookForm.reset();
        this.toast.setMessage('Webhook registered successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(webhook) {
    this.isEditing = true;
    this.webhook = webhook;
  }

  cancelEditing() {
    this.isEditing = false;
    this.webhook = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the webhooks to reset the editing
    this.getWebhooks();
  }

  editWebhook(webhook) {
    this.webhookService.editWebhook(webhook).subscribe(
      res => {
        this.isEditing = false;
        this.webhook = webhook;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteWebhook(webhook) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.webhookService.deleteWebhook(webhook).subscribe(
        res => {
          const pos = this.webhooks.map(elem => elem._id).indexOf(webhook._id);
          this.webhooks.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  onSelectWebhook(webhook) {

  }

}
