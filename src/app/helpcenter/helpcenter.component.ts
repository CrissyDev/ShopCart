import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help-center', 
  imports:[CommonModule, FormsModule],
  templateUrl: './helpcenter.component.html',
  styleUrls: ['./helpcenter.component.css']
})
export class HelpCenterComponent {
  userQuestion: string = '';
  questionSent: boolean = false;

  faqs = [
    {
      question: 'What cities do you currently support?',
      answer: 'We currently support all major towns across Kenya, including Nairobi, Mombasa, Kisumu, and Eldoret.',
      open: false
    },
    {
      question: 'How can I pay for my order?',
      answer: 'We accept M-Pesa, PayPal, and all major debit/credit cards.',
      open: false
    },
    {
      question: 'Can I return a product after purchase?',
      answer: 'Yes. Products can be returned within 7 days of delivery provided they are unused and in original packaging.',
      open: false
    },
    {
      question: 'How do I track my order?',
      answer: 'You can track your order through the “My Orders” section in your account dashboard.',
      open: false
    },
    {
      question: 'Do you offer same-day delivery?',
      answer: 'Yes, we offer same-day delivery in Nairobi for orders placed before 12 PM.',
      open: false
    },
    {
      question: 'What if my payment fails?',
      answer: 'If your payment fails, please retry or try an alternative method. Contact our support for unresolved issues.',
      open: false
    },
    {
      question: 'How do I cancel my order?',
      answer: 'You can cancel an order before it is shipped. Visit your orders page and click “Cancel”.',
      open: false
    },
    {
      question: 'Is my personal data safe with you?',
      answer: 'Absolutely. We use the latest encryption and never share your data without consent.',
      open: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  sendQuestion(): void {
    if (this.userQuestion.trim()) {
      this.questionSent = true;
      setTimeout(() => {
        this.questionSent = false;
        this.userQuestion = '';
      }, 3000);
    }
  }
}
