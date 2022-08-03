const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
// create a document the same way as above

const createPdf = async (data) => {
  try {
    const date = moment().locale("es").format("DD-MM-YYYY HH:mm");
    const doc = new PDFDocument({
      size: [300, 110],
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
      numeroSolicitudPad,
    } = data;

    doc.image(`${__dirname}/../../assets/images/Logo_Tigo.png`, 8, 18, {
      width: 50,
    });

    doc.font(`${__dirname}/../../assets/fonts/Roboto-Bold.ttf`, 9).text("Empresa:", 70, 5);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Regular.ttf`, 9).text(compania, 120, 5);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Bold.ttf`, 9).text("Nº. Radicado:", 70, 16);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Regular.ttf`, 9).text(numeroSolicitudPad, 135, 16);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Bold.ttf`, 9).text("Fecha:", 70, 27);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Regular.ttf`, 9).text(date, 100, 27);

    //doc.font(`${__dirname}/../../assets/fonts/Roboto-Bold.ttf`, 9).text("Folios:", 220, 27);
    //doc.font(`${__dirname}/../../assets/fonts/Roboto-Regular.ttf`, 9).text(medio_recepcion, 250, 27);

    doc.font(`${__dirname}/../../assets/fonts/Roboto-Bold.ttf`, 9).text("Asunto:", 70, 38);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Regular.ttf`, 9).text(clases_asunto, 70, 49);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Bold.ttf`, 9).text("Tipo Documental:", 200, 38);
    doc.font(`${__dirname}/../../assets/fonts/Roboto-Regular.ttf`, 9).text(tipo_documental, 200, 49);

    doc
      .font(
        `${__dirname}/../../assets/fonts/LibreBarcode39Text-Regular.ttf`,
        25
      )
      .text(`*${numeroSolicitudPad}*`, 0, 60, { align: "center" });
      doc.pipe(
        fs.createWriteStream(`${__dirname}/../../temp/${numeroSolicitudPad}.pdf`)
      );
  
    doc.end();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = createPdf;
