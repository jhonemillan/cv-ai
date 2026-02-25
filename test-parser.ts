import { PDFParse } from 'pdf-parse';
import fs from 'fs';
import path from 'path';

async function test() {
    const pdfPath = path.join(process.cwd(), 'server', 'HojaVIda.pdf');
    if (!fs.existsSync(pdfPath)) {
        console.error('PDF file not found at:', pdfPath);
        return;
    }

    console.log('Reading PDF:', pdfPath);
    const dataBuffer = fs.readFileSync(pdfPath);

    try {
        console.log('Instantiating PDFParse...');
        const parser = new PDFParse({ data: dataBuffer });
        console.log('Calling parser.getText()...');
        const data = await parser.getText();
        console.log('Successfully extracted text!');
        fs.writeFileSync('output.txt', data.text);
        console.log('Extracted text written to output.txt');
        console.log('Text preview:', data.text.substring(0, 100).replace(/\n/g, ' ') + '...');
    } catch (error) {
        console.error('Error during parsing:', error);
    }
}

test();
