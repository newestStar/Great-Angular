import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Hero } from '../../../core/store/hero/hero.model';
import * as fromRoot from '../../../core/store';
import * as actions from '../../../core/store/hero/hero.actions';
import { entityNames } from '../../../core/store/util'

let uuid = require('uuid');

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.css']
})
export class HeroListComponent implements OnInit, OnDestroy {
  heroes$: Observable<Hero[]>;
  selectedHero$: Observable<Hero>;
  routeSub: Subscription;
  heroesSub: Subscription;
  maxHeroId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.RootState>,
    private location: Location) { }

  ngOnInit(): void {
    this.heroes$ = this.store.select(fromRoot.getHeroes);
    this.selectedHero$ = this.store.select(fromRoot.getSelectedHero);
    this.heroesSub = this.heroes$.subscribe(heroes =>
      this.maxHeroId = +heroes.reduce((prev, current, index, array) => { return +current.id > +prev.id ? current : prev }, { id: '0' }).id);
    this.routeSub = this.route.params
      .subscribe((params: Params) => {
        this.store.dispatch(new actions.Select({ id: +params['id'] }, entityNames.HERO));
      })
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.store.dispatch(new actions.Add({ id: this.maxHeroId + 1, name }, entityNames.HERO));
  }

  delete(hero: Hero): void {
    this.store.dispatch(new actions.Delete(hero, entityNames.HERO));
  }

  onSelect(hero: Hero) {
    this.router.navigate([hero.id], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.routeSub && this.routeSub.unsubscribe();
    this.heroesSub && this.heroesSub.unsubscribe();
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
