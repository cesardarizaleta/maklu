import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThesisService } from '../services/thesis.service';
import { FullThesis, ThesisPart } from '../models/models';

@Component({
  selector: 'app-thesis-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './thesis-detail.html',
  styleUrl: './thesis-detail.css',
})
export class ThesisDetail implements OnInit, OnDestroy {
  thesisId = signal('');
  thesis = signal<FullThesis | null>(null);
  loading = signal(false);
  editingPart = signal<string | null>(null);
  editContent = signal('');
  pollingInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private thesisService: ThesisService
  ) {}

  ngOnInit() {
    this.thesisId.set(this.route.snapshot.params['id']);
    this.loadThesis();
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  loadThesis() {
    this.loading.set(true);
    this.thesisService.getFullThesis(this.thesisId()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.thesis.set(response.data);
          // Si está generando, iniciar polling
          if (response.data.status === 'generating') {
            this.startPolling();
          }
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  startPolling() {
    this.pollingInterval = setInterval(() => {
      if (this.thesis()?.status === 'generating') {
        this.loadThesis();
      } else {
        clearInterval(this.pollingInterval);
      }
    }, 10000); // Poll cada 10 segundos
  }

  startEdit(part: ThesisPart) {
    this.editingPart.set(part.key);
    this.editContent.set(part.content);
  }

  saveEdit() {
    if (!this.editingPart()) return;

    this.thesisService.updatePart(this.thesisId(), this.editingPart()!, { content: this.editContent() }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadThesis(); // Recargar para mostrar cambios
          this.editingPart.set(null);
        }
      },
      error: (error) => {
        console.error('Error updating part:', error);
        alert('Error al guardar cambios');
      }
    });
  }

  cancelEdit() {
    this.editingPart.set(null);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getSections(): string[] {
    return Object.keys(this.getPartsBySection());
  }

  getPartsBySection(): { [section: string]: ThesisPart[] } {
    if (!this.thesis()) return {};

    const parts = Object.values(this.thesis()!.parts);
    const sections: { [section: string]: ThesisPart[] } = {};

    parts.forEach(part => {
      const section = part.key.split('.')[0];
      if (!sections[section]) sections[section] = [];
      sections[section].push(part);
    });

    return sections;
  }

  getSectionTitle(section: string): string {
    const titles: { [key: string]: string } = {
      'preliminaries': 'Preliminares',
      'introduction': 'Introducción',
      'methodology': 'Metodología',
      'results': 'Resultados',
      'conclusions': 'Conclusiones',
      'references': 'Referencias'
    };
    return titles[section] || section.charAt(0).toUpperCase() + section.slice(1);
  }
}
