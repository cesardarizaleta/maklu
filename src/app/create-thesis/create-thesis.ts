import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThesisService } from '../services/thesis.service';
import { CreateThesisDto } from '../models/models';

@Component({
  selector: 'app-create-thesis',
  imports: [FormsModule],
  templateUrl: './create-thesis.html',
  styleUrl: './create-thesis.css',
})
export class CreateThesis {
  idea = signal('');
  discipline = signal('');
  generating = signal(false);

  constructor(
    private thesisService: ThesisService,
    private router: Router
  ) {}

  createThesis() {
    if (!this.idea().trim()) return;

    this.generating.set(true);
    const dto: CreateThesisDto = {
      idea: this.idea().trim(),
      discipline: this.discipline().trim() || undefined
    };

    this.thesisService.createFromIdea(dto).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          alert('¡Tesis creada exitosamente! La generación puede tomar varios minutos.');
          this.router.navigate(['/thesis', response.data.id]);
        } else {
          alert('Error al crear tesis: ' + (response.message || 'Error desconocido'));
        }
        this.generating.set(false);
      },
      error: (error) => {
        console.error('Error creating thesis:', error);
        alert('Error al crear tesis. Verifica tu API key y conexión.');
        this.generating.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
