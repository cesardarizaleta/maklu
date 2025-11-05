import { Injectable } from '@angular/core';
import { FullThesis, ThesisPart } from '../models/models';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  TabStopType,
  TabStopPosition
} from 'docx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor() { }

  async exportToWord(thesis: FullThesis): Promise<void> {
    const doc = this.generateWordDocument(thesis);
    await this.downloadWordFile(doc, thesis.title);
  }

  exportToPDF(thesis: FullThesis): void {
    const docDefinition = this.generatePDFDocument(thesis);
    pdfMake.createPdf(docDefinition).download(`${thesis.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  }

  private generateWordDocument(thesis: FullThesis): Document {
    const children = [];

    // Portada
    children.push(...this.generateCoverPage(thesis));

    // Salto de página
    children.push(new Paragraph({
      children: [new TextRun({ text: '', break: 1 })],
      pageBreakBefore: true
    }));

    // Índice
    children.push(...this.generateTableOfContents(thesis));

    // Salto de página
    children.push(new Paragraph({
      children: [new TextRun({ text: '', break: 1 })],
      pageBreakBefore: true
    }));

    // Contenido
    children.push(...this.generateThesisContent(thesis));

    return new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });
  }

  private generateCoverPage(thesis: FullThesis): Paragraph[] {
    const paragraphs = [];

    // REPÚBLICA BOLIVARIANA DE VENEZUELA
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA',
          bold: true,
          size: 24,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    }));

    // UNIVERSIDAD JOSÉ ANTONIO PÁEZ
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'UNIVERSIDAD JOSÉ ANTONIO PÁEZ',
          bold: true,
          size: 24,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    }));

    // FACULTAD DE INGENIERÍA
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'FACULTAD DE INGENIERÍA',
          bold: true,
          size: 22,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    }));

    // ESCUELA DE INGENIERÍA EN COMPUTACIÓN
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'ESCUELA DE INGENIERÍA EN COMPUTACIÓN',
          bold: true,
          size: 22,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    }));

    // Espacio reducido para mejor proporción
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { after: 300 }
    }));

    // Título de la tesis (dividido en líneas si es necesario)
    const titleLines = this.splitTitleIntoLines(thesis.title);
    titleLines.forEach((line, index) => {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: line,
            bold: true,
            size: 20,
            font: 'Times New Roman',
            color: '#000000'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: index === titleLines.length - 1 ? 300 : 100 }
      }));
    });

    // Espacio reducido
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { after: 250 }
    }));

    // Autores
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'Autores:',
          bold: true,
          size: 18,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 150 }
    }));

    // Autor principal (usando el nombre de la tesis)
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'Nombre del Autor',
          size: 16,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 }
    }));

    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'C.I: [Número de Cédula]',
          size: 16,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 }
    }));

    // Tutor
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'Tutor:',
          bold: true,
          size: 18,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 150 }
    }));

    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: '[Nombre del Tutor]',
          size: 16,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 }
    }));

    // Fecha
    const currentDate = new Date();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateStr = `San Diego, ${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;

    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: dateStr,
          size: 16,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 150 }
    }));

    return paragraphs;
  }

  private splitTitleIntoLines(title: string): string[] {
    // Dividir el título en líneas más cortas para mejor presentación
    const words = title.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).length > 50) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private generateTableOfContents(thesis: FullThesis): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Título del índice
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: 'CONTENIDO',
          bold: true,
          size: 12,
          font: 'Times New Roman',
          color: '#000000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    }));

    // Contenido del índice
    const sections = this.getSectionsFromParts(Object.values(thesis.parts));
    let pageNumber = 1;

    sections.forEach(section => {
      const sectionTitle = this.getSectionTitle(section);

      // Título de sección
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: sectionTitle,
            bold: true,
            size: 12,
            font: 'Times New Roman',
            color: '#000000'
          }),
          new TextRun({
            text: '\t' + pageNumber,
            size: 12,
            font: 'Times New Roman',
            color: '#000000'
          })
        ],
        tabStops: [{
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX
        }],
        spacing: { after: 100 }
      }));

      // Subsecciones
      const partsInSection = Object.values(thesis.parts).filter((part: any) =>
        part.key.startsWith(section + '.')
      );

      partsInSection.forEach((part: any) => {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: '  ' + part.title,
              size: 12,
              font: 'Times New Roman',
              color: '#000000'
            }),
            new TextRun({
              text: '\t' + pageNumber,
              size: 12,
              font: 'Times New Roman',
              color: '#000000'
            })
          ],
          tabStops: [{
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX
          }],
          spacing: { after: 50 }
        }));
        pageNumber++;
      });

      pageNumber++;
    });

    return paragraphs;
  }

  private generateThesisContent(thesis: FullThesis): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    const sections = this.getSectionsFromParts(Object.values(thesis.parts));

    sections.forEach(section => {
      const sectionTitle = this.getSectionTitle(section);

      // Título de sección
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: sectionTitle.toUpperCase(),
            bold: true,
            size: 12,
            font: 'Times New Roman',
            color: '#000000'
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300, before: 300 }
      }));

      const partsInSection = Object.values(thesis.parts).filter((part: any) =>
        part.key.startsWith(section + '.')
      );

      partsInSection.forEach((part: any) => {
        // Título de parte
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: part.title,
              bold: true,
              size: 12,
              font: 'Times New Roman',
              color: '#000000'
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 200 }
        }));

        // Contenido
        const contentParagraphs = this.formatContentForWord(part.content);
        paragraphs.push(...contentParagraphs);
      });
    });

    return paragraphs;
  }

  private formatContentForWord(content: string): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Dividir en párrafos
    const contentParagraphs = content.split('\n\n').filter(p => p.trim());

    contentParagraphs.forEach(paragraph => {
      // Limpiar espacios
      paragraph = paragraph.trim();

      if (paragraph) {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: paragraph,
              size: 12,
              font: 'Times New Roman',
              color: '#000000'
            })
          ],
          spacing: { after: 240, line: 480 }, // Interlineado doble (240 = espacio después, 480 = altura de línea)
          indent: { firstLine: 720 } // Sangría de primera línea (0.5 pulgadas)
        }));
      }
    });

    return paragraphs;
  }

  private generatePDFDocument(thesis: FullThesis): any {
    const content: any[] = [];

    // Configuración de página APA
    const pageMargins = [72, 72, 72, 72]; // 2.54 cm = 72 puntos (1 pulgada = 72 puntos)

    // Portada
    content.push(...this.generatePDFCoverPage(thesis));

    // Salto de página
    content.push({ text: '', pageBreak: 'after' });

    // Índice
    content.push(...this.generatePDFTableOfContents(thesis));

    // Salto de página
    content.push({ text: '', pageBreak: 'after' });

    // Contenido
    content.push(...this.generatePDFContent(thesis));

    return {
      content: content,
      pageSize: 'LETTER', // Tamaño carta (8.5 x 11 pulgadas)
      pageMargins: pageMargins,
      defaultStyle: {
        font: 'Times',
        fontSize: 12,
        lineHeight: 2, // Interlineado doble
        alignment: 'left', // Alineación izquierda según normas APA
        color: '#000000'
      },
      styles: {
        header1: {
          font: 'Times',
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 10],
          alignment: 'center',
          color: '#000000'
        },
        header2: {
          font: 'Times',
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 8],
          color: '#000000'
        },
        coverTitle: {
          font: 'Times',
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 10],
          color: '#000000'
        },
        coverInstitution: {
          font: 'Times',
          fontSize: 12,
          bold: true,
          alignment: 'center',
          margin: [0, 5, 0, 5],
          color: '#000000'
        },
        normalText: {
          font: 'Times',
          alignment: 'left',
          margin: [36, 0, 0, 0], // Sangría de 36 puntos (0.5 pulgadas) para primera línea
          color: '#000000'
        }
      },
      footer: function(currentPage: number, pageCount: number) {
        return {
          text: currentPage.toString(),
          font: 'Times',
          alignment: 'right',
          margin: [0, 0, 72, 36], // Margen derecho de 1 pulgada
          color: '#000000'
        };
      }
    };
  }

  private generatePDFCoverPage(thesis: FullThesis): any[] {
    const content: any[] = [];

    // REPÚBLICA BOLIVARIANA DE VENEZUELA
    content.push({
      text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA',
      style: 'coverInstitution',
      fontSize: 14,
      color: '#000000'
    });

    // UNIVERSIDAD JOSÉ ANTONIO PÁEZ
    content.push({
      text: 'UNIVERSIDAD JOSÉ ANTONIO PÁEZ',
      style: 'coverInstitution',
      fontSize: 14,
      color: '#000000'
    });

    // FACULTAD DE INGENIERÍA
    content.push({
      text: 'FACULTAD DE INGENIERÍA',
      style: 'coverInstitution',
      fontSize: 12,
      color: '#000000'
    });

    // ESCUELA DE INGENIERÍA EN COMPUTACIÓN
    content.push({
      text: 'ESCUELA DE INGENIERÍA EN COMPUTACIÓN',
      style: 'coverInstitution',
      fontSize: 12,
      color: '#000000'
    });

    // Espacio reducido para mejor proporción
    content.push({ text: '', margin: [0, 20, 0, 0] });

    // Título de la tesis (dividido en líneas)
    const titleLines = this.splitTitleIntoLines(thesis.title);
    titleLines.forEach((line: string) => {
      content.push({
        text: line,
        style: 'coverTitle',
        color: '#000000'
      });
    });

    // Espacio reducido
    content.push({ text: '', margin: [0, 30, 0, 0] });

    // Autores
    content.push({
      text: 'Autores:',
      bold: true,
      fontSize: 12,
      font: 'Times',
      alignment: 'left',
      margin: [0, 15, 0, 8],
      color: '#000000'
    });

    content.push({
      text: 'Nombre del Autor',
      fontSize: 12,
      font: 'Times',
      alignment: 'left',
      margin: [0, 5, 0, 5],
      color: '#000000'
    });

    content.push({
      text: 'C.I: [Número de Cédula]',
      fontSize: 12,
      font: 'Times',
      alignment: 'left',
      margin: [0, 5, 0, 15],
      color: '#000000'
    });

    // Tutor
    content.push({
      text: 'Tutor:',
      bold: true,
      fontSize: 12,
      font: 'Times',
      alignment: 'left',
      margin: [0, 8, 0, 8],
      color: '#000000'
    });

    content.push({
      text: '[Nombre del Tutor]',
      fontSize: 12,
      font: 'Times',
      alignment: 'left',
      margin: [0, 5, 0, 15],
      color: '#000000'
    });

    // Fecha
    const currentDate = new Date();
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dateStr = `San Diego, ${monthNames[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;

    content.push({
      text: dateStr,
      fontSize: 12,
      font: 'Times',
      alignment: 'left',
      margin: [0, 15, 0, 0],
      color: '#000000'
    });

    return content;
  }

  private generatePDFTableOfContents(thesis: FullThesis): any[] {
    const content: any[] = [];

    // Título del índice
    content.push({
      text: 'CONTENIDO',
      style: 'header1',
      pageBreak: 'before',
      color: '#000000'
    });

    // Contenido del índice
    const sections = this.getSectionsFromParts(Object.values(thesis.parts));
    let pageNumber = 1;

    sections.forEach(section => {
      const sectionTitle = this.getSectionTitle(section);

      content.push({
        columns: [
          { text: sectionTitle, width: '*', alignment: 'left', font: 'Times', fontSize: 12, color: '#000000' },
          { text: pageNumber.toString(), width: 50, alignment: 'right', font: 'Times', fontSize: 12, color: '#000000' }
        ],
        margin: [0, 5, 0, 5]
      });

      const partsInSection = Object.values(thesis.parts).filter((part: any) =>
        part.key.startsWith(section + '.')
      );

      partsInSection.forEach((part: any) => {
        content.push({
          columns: [
            { text: '  ' + part.title, width: '*', alignment: 'left', font: 'Times', fontSize: 12, color: '#000000' },
            { text: pageNumber.toString(), width: 50, alignment: 'right', font: 'Times', fontSize: 12, color: '#000000' }
          ],
          margin: [0, 3, 0, 3]
        });
        pageNumber++;
      });

      pageNumber++;
    });

    return content;
  }

  private generatePDFContent(thesis: FullThesis): any[] {
    const content: any[] = [];

    const sections = this.getSectionsFromParts(Object.values(thesis.parts));

    sections.forEach(section => {
      const sectionTitle = this.getSectionTitle(section);

      // Título de sección
      content.push({
        text: sectionTitle.toUpperCase(),
        style: 'header1',
        pageBreak: 'before',
        color: '#000000'
      });

      const partsInSection = Object.values(thesis.parts).filter((part: any) =>
        part.key.startsWith(section + '.')
      );

      partsInSection.forEach((part: any) => {
        // Título de parte
        content.push({
          text: part.title,
          style: 'header2',
          color: '#000000'
        });

        // Contenido con formato APA
        const paragraphs = part.content.split('\n\n').filter((p: string) => p.trim());
        paragraphs.forEach((paragraph: string) => {
          if (paragraph.trim()) {
            content.push({
              text: paragraph.trim(),
              style: 'normalText',
              margin: [36, 0, 0, 10], // Sangría de 36 puntos (0.5 pulgadas)
              color: '#000000'
            });
          }
        });
      });
    });

    return content;
  }

  private getSectionsFromParts(parts: ThesisPart[]): string[] {
    const sections = new Set<string>();

    parts.forEach(part => {
      const section = part.key.split('.')[0];
      sections.add(section);
    });

    return Array.from(sections).sort();
  }

  private getSectionTitle(section: string): string {
    const titles: { [key: string]: string } = {
      'preliminaries': 'Preliminares',
      'introduction': 'Introducción',
      'methodology': 'Metodología',
      'results': 'Resultados',
      'conclusions': 'Conclusiones',
      'references': 'Referencias'
    };
    return titles[section] || section.charAt(0).toUpperCase() + section.slice(1);
  }

  private async downloadWordFile(doc: Document, title: string): Promise<void> {
    const buffer = await Packer.toBuffer(doc);
    const uint8Array = new Uint8Array(buffer);

    const blob = new Blob([uint8Array], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }
}
