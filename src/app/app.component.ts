import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

interface Note {
  title: string;
  textContent: SafeHtml | undefined;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit, AfterViewInit {
  modules = {
    formula: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['formula'],
      ['image', 'code-block'],
    ],
  };

  title: string = '';
  textContent: SafeHtml | undefined;
  notes: Note[] = [
    {
      textContent: '<p>Contenido de la primera tarjeta</p>',
      title: 'Primera Tarjeta',
    },
    {
      textContent: '<p>Contenido de la segunda tarjeta</p>',
      title: 'Segunda Tarjeta',
    },
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}

  initText(quill: any) {
    quill.editor.clipboard.addMatcher(
      Node.ELEMENT_NODE,
      function (node: any, delta: any) {
        delta.forEach((e: any) => {
          if (e && e.attributes) {
            delete e.attributes;
          }
        });
        return delta;
      }
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.notes.forEach((element) => {
      element.textContent = this.adjustImage(element.textContent);
    });
  }

  saveNote(): void {
    if (this.title != '' && this.textContent != '') {
      this.notes.push({
        title: this.title,
        textContent: this.adjustImage(this.textContent),
      });

      this.addSingle('success', '', 'Nota creada con éxito');
    } else {
      this.addSingle(
        'error',
        '',
        'Por favor complete los campos del formulario'
      );
    }

    this.title = '';
    this.textContent = '';
  }

  adjustImage(str: any) {
    try {
      str = str.toString();
      str = str.replace(/<img/g, '<img width = 50% ');
      return this.sanitizer.bypassSecurityTrustHtml(str);
    } catch (error) {
      return this.sanitizer.bypassSecurityTrustHtml(str);
    }
  }

  addSingle(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}
