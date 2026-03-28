declare module 'pdfkit' {
  export default class PDFDocument {
    constructor(options?: any);
    fontSize(size: number): this;
    font(name: string): this;
    text(text: string, options?: any): this;
    moveDown(lines?: number): this;
    end(): void;
    on(event: string, callback: (...args: any[]) => void): void;
  }
}
