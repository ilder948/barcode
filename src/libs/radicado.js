const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');
// create a document the same way as above

const createPdf = async (data) => {
  try {
    const date = moment().locale('es').format('LLL');
    const doc = new PDFDocument({
      size: [300, 125],
      margins: {
        top: 7,
        bottom: 2,
        left: 2,
        right: 2,
      },
    });

    const {
      medio_recepcion,
      compania,
      clases_asunto,
      tipo_documental,
      numero_solicitud,
    } = data;

    doc.text('Radicado N°.', { align: 'center' }).font('Times-Roman', 25);
    doc
      .font(
        `${__dirname}/../../assets/fonts/LibreBarcode39Text-Regular.ttf`,
        35
      )
      .text(`*${numero_solicitud}*`, { align: 'center' });

    doc.font('Times-Bold', 10).text('Fecha:', 6, 64);
    doc.font('Times-Roman', 10).text(date, 5, 64, { align: 'right' });
    doc.font('Times-Bold', 10).text('Medio Recepcion:', 6, 75);
    doc
      .font('Times-Roman', 10)
      .text(medio_recepcion, 90, 75, { align: 'right' });
    doc.font('Times-Bold', 10).text('Compania:', 6, 86);
    doc.font('Times-Roman', 10).text(compania, 90, 86, { align: 'right' });
    doc.font('Times-Bold', 10).text('Asunto:', 6, 97);
    doc.font('Times-Roman', 10).text(clases_asunto, 90, 97, { align: 'right' });
    doc.font('Times-Bold', 10).text('Tipo Documental:', 6, 108);
    doc
      .font('Times-Roman', 10)
      .text(tipo_documental, 90, 108, { align: 'right' });
    doc.pipe(
      fs.createWriteStream(`${__dirname}/../../temp/${numero_solicitud}.pdf`)
    );

    doc.end();
    return true
  } catch (error) {
    console.log(error);
    return false
  }
};

module.exports = createPdf;
