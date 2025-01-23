import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent {
  isMobile: boolean = false;
  sidenavOpen = false;
  activeMenu: string = 'user'; // Default active menu item

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
    this.sidenav.toggle();
  }
  constructor(private router: Router) { }
  ngOnInit() {
    this.checkScreenSize();
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Toggle sidenav on menu button click
  toggleSidenav(): void {
    this.sidenav.toggle();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
  }
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
