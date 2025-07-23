import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAdminRoute = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.checkIfAdminRoute(this.router.url);

    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkIfAdminRoute(event.url);
    });
  }

  private checkIfAdminRoute(url: string): void {
    this.isAdminRoute = url.includes('/admin');
  }
}
