import { Component, OnInit, OnDestroy, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  showDeleteModal = signal(false);
  thesisToDelete = signal<Thesis | null>(null);

  constructor(
    private thesisService: ThesisService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTheses();
    // Solo iniciar polling en el navegador, no durante SSR/hidratación
    if (isPlatformBrowser(this.platformId)) {
      // Pequeño delay para permitir que la hidratación se complete
      setTimeout(() => this.startPolling(), 1000);
    }
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

  confirmDelete(thesis: Thesis) {
    this.thesisToDelete.set(thesis);
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.thesisToDelete.set(null);
    this.showDeleteModal.set(false);
  }

  deleteThesis() {
    const thesis = this.thesisToDelete();
    if (!thesis) return;

    this.thesisService.deleteThesis(thesis.id).subscribe({
      next: (response) => {
        if (response.success) {
          // Remover la tesis de la lista local
          this.theses.set(this.theses().filter(t => t.id !== thesis.id));
          this.showDeleteModal.set(false);
          this.thesisToDelete.set(null);
          alert('Tesis eliminada exitosamente');
        } else {
          alert('Error al eliminar tesis: ' + (response.message || 'Error desconocido'));
        }
      },
      error: (error) => {
        console.error('Error deleting thesis:', error);
        alert('Error al eliminar tesis. Inténtalo de nuevo.');
      }
    });
  }
}
