import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  search$ = this.searchTerm.asObservable();

  setSearchTerm(term: string): void {
    this.searchTerm.next(term);
  }
}
