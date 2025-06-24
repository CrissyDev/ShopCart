import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  success = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.success = true;

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000); 
    }, 1500); 
  }
}

