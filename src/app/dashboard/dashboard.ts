import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThesisService } from '../services/thesis.service';
import { Thesis } from '../models/models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  theses = signal<Thesis[]>([]);
  loading = signal(false);
  pollingInterval: any;

  constructor(
    private thesisService: ThesisService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTheses();
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  startPolling() {
    this.pollingInterval = setInterval(() => {
      const hasGenerating = this.theses().some(thesis => thesis.status === 'generating');
      if (hasGenerating) {
        this.loadTheses();
      }
    }, 10000); // Poll cada 10 segundos
  }

  loadTheses() {
    this.loading.set(true);
    this.thesisService.getTheses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.theses.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  createNew() {
    this.router.navigate(['/create']);
  }

  viewThesis(id: string) {
    this.router.navigate(['/thesis', id]);
  }

  logout() {
    localStorage.removeItem('maklu-api-key');
    this.router.navigate(['/auth']);
  }
}
