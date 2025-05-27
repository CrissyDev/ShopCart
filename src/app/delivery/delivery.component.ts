import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent {
  features = [
    {
      title: 'Robots-driver',
      description: 'Our mini-robots move autonomously and ensure fast delivery to any part of the city.',
      icon: 'fas fa-robot'
    },
    {
      title: 'Online delivery ordering',
      description: 'Order from anywhere in the city using our efficient online system.',
      icon: 'fas fa-laptop'
    },
    {
      title: 'Support Team',
      description: 'Our team is available 24/7 to support your delivery needs.',
      icon: 'fas fa-headset'
    }
  ];
}
