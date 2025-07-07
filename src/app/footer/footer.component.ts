import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  email: string = '';
  emailSent: boolean = false;

  sendEmail(form: any): void {
    if (form.valid) {
      
      this.emailSent = true;

      this.email = '';

      setTimeout(() => {
        this.emailSent = false;
      }, 3000);
    }
  }
}
