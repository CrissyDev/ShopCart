import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-helpcenter',
  imports: [CommonModule, FormsModule],
  templateUrl: './helpcenter.component.html',
  styleUrl: './helpcenter.component.css'
})
export class HelpcenterComponent {
  categories = [
    { icon: '📦', title: 'Orders' },
    { icon: '💳', title: 'Payment' },
    { icon: '🔄', title: 'Returns' },
  ];

  faqs = [
    { question: 'How do I track my order?', answer: 'You can track via your account.', open: false },
    { question: 'What payment methods are accepted?', answer: 'We accept M-Pesa, Visa, and Mastercard.', open: false },
  ];

  userQuestion: string = '';
  questionSent: boolean = false;

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  sendQuestion(): void {
    if (this.userQuestion.trim() !== '') {
      this.questionSent = true;
      setTimeout(() => (this.questionSent = false), 3000);
      this.userQuestion = '';
    }
  }
}
