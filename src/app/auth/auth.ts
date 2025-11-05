import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  apiKey = signal('');
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedKey = localStorage.getItem('maklu-api-key');
      if (savedKey) {
        this.apiKey.set(savedKey);
      }
    }
  }

  saveApiKey() {
    if (this.apiKey().trim()) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('maklu-api-key', this.apiKey().trim());
      }
      this.router.navigate(['/dashboard']);
    }
  }
}
