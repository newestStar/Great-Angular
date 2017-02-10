import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as fromRoot from '../core/store';
import { Contact } from '../core/store/contact/contact.model';
import { User } from '../core/store/user/user.model';
import * as contact from '../core/store/contact/contact.actions';
import * as layout from '../core/store/layout/layout.actions';

let uuid = require('uuid');

@Component({
    selector: 'app-contact',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'contact.page.html',
    styleUrls: ['contact.page.css']
})
export class ContactPage implements OnInit {
    contact$: Observable<Contact>;

    msg$: Observable<string>;
    user$: Observable<User>;
    contactForm: FormGroup;

    constructor(private store: Store<fromRoot.RootState>,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.user$ = this.store.select(fromRoot.getUserState);
        this.msg$ = this.store.select(fromRoot.getMsg);
        this.contact$ = this.store.select(fromRoot.getContact);
        this.contact$.subscribe(contact => {
            this.contactForm = this.formBuilder.group({
                name: [contact ? contact.name : '', Validators.required],  // TODO: fix this hack
                id: [contact ? contact.id : '', Validators.required]  // TODO: fix this hack
            })
        });
    }

    nextContact() {
        this.store.dispatch(new contact.NextContactAction());
    }

    newContact() {
        this.store.dispatch(new contact.AddContactAction({
            id: uuid.v1(),
            name: ''
        }));
    }

    onSubmit() {
        this.store.dispatch(new contact.UpdateContactAction(
            this.contactForm.value));
    }

}

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/