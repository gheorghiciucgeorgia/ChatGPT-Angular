import { Component,ViewEncapsulation,ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// component: decoratorul pentru definirea componentei Angular
// ViewEncapsulation: ca sa dezactiveze izolarea css adica pentru tailwind
// ChangeDetectorRef: serviciul angular care permite fortarea actualizarii UI-ului
//  RouterOutlet, FormsModule, CommonModule: Module standalone pe care le imporți pentru funcționalități precum routing, ngModel (pentru form binding) și funcții comune Angular.

@Component({
  selector: 'app-root', //cum o sa fie folosit in html adica in index.html
  imports: [CommonModule, FormsModule], // importarea modulelor necesare pentru template
  templateUrl: './app.html', // cui fisier i se va apluca toate modificarile din acest fisier
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None, // pentru tailwind css care este  global
})
export class App {
  message = ''; // textul din input care este legat cu ngModel adica continutul lui
  buttonIconClass = 'fa-solid fa-paper-plane'; //clasa iconitei butonului de send message este legata cu [class] in html

 constructor(private cdr:ChangeDetectorRef){} // injecteaza ChangeDetectorRef pentru a forta Angular sa actualizeze view-ul cand se schimba ceva

 // functia de trimitere mesaj a.k.a se face apel spre API-ul de chatgpt si aceasta se activeaza
 // in html in momentul in care se da enter sau se da click pe butonul de send
 sendMessage() {
    const msg = this.message.trim(); 
    if (!msg) return; // se verifica daca mesajul nu este gol

    this.appendMessage('user', msg); // se adauga mesajul util. in chat a.k.a container din html file
    this.message = ''; // se reseteaza input-ul

    if (msg.toLowerCase() === 'developer') {
      this.simulateBotTyping();
      setTimeout(() => {
        this.appendMessage('bot', 'This Source Coded By Reza Mehdikhanlou \nYoutube : @AsmrProg');
        this.resetIcon();
      }, 2000);
      return;
    }

    this.simulateBotTyping(); // aici se face schimbarea de clasa de la buton ca sa se vada ca in timp ce se asteapta respunsul
    // de la gpt sa se incarca

    //Mai jos se face apelare de POST la API prin fetch

    fetch('https://chatgpt-42.p.rapidapi.com/conversationgpt4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '', // ← Adaugă cheia ta reală aici
        'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: msg }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.appendMessage('bot', data.result); //se primeste raspunsul si se adauga in chat
        // prin functia appendMessage
        this.resetIcon(); // se reseteaza clasa de la buton cu cea initial aratand ca s-a terminat de incarcat
      })
      .catch((err) => {
        this.appendMessage('bot', 'Error: ' + err.message);
        this.resetIcon();
        // la fel si pentru eroare
      });
  }

  // functie de schimbare a clasei de la button + schimbarea fortata in html
  simulateBotTyping() {
    this.buttonIconClass = 'fas fa-spinner fa-pulse';
    this.cdr.detectChanges();
  }

  // la fel si aici ca mai sus
  resetIcon() {
    this.buttonIconClass = 'fa-solid fa-paper-plane';
    this.cdr.detectChanges();
  }

  // Functie de adaugare a mesajului in container
  // adica crearea de elemente DOM manual
  appendMessage(sender: 'user' | 'bot', text: string) {
    const chatLog = document.getElementById('chat-log'); // luat cu vanilla js
    if (!chatLog) return; // daca chatllog este fals atunci se intrerupe executia functiei

    const chatBox = document.createElement('div');
    const iconDiv = document.createElement('div');
    const messageDiv = document.createElement('div');
    const icon = document.createElement('i');

    chatBox.classList.add('chat-box');
    iconDiv.classList.add('icon');
    messageDiv.classList.add(sender);
    messageDiv.innerText = text;

    if (sender === 'user') {
      icon.classList.add('fa-regular', 'fa-circle-user');
      iconDiv.id = 'user-icon';
    } else {
      icon.classList.add('fa-solid', 'fa-robot');
      iconDiv.id = 'bot-icon';
    }

    iconDiv.appendChild(icon);
    chatBox.appendChild(iconDiv);
    chatBox.appendChild(messageDiv);
    chatLog.appendChild(chatBox);

    chatLog.scrollTop = chatLog.scrollHeight;
  }
}
