const consecutivos = require('./model');
const templateRadicado = require('../../libs/radicado')
const alfresco = require('../../libs/alfresco');
const config = require('../../config');
const RadicadosCtrl = {};
const fs = require('fs')
const moment = require('moment')
const alfrescoModule = new alfresco()

RadicadosCtrl.getRadicados = async (req, res) => {
  try {
    const data = await consecutivos.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

RadicadosCtrl.getRadicado = async (req, res) => {
  let message, stiker;
  let numero_solicitud;
  try {
    const id = req.body.solicitud;
    let year = new Date().getFullYear();
    const radicado = await getRadicadoByIdInicial(id);
    if (!radicado) {
      const query = {
        id_inicial: id,
        anio_actual: year,
        numero_solicitud: 0,
      }
      const data = await createSolicitud(query);
      message = {
        consecutivo: data.dataValues.numero_solicitud
      };
    } else {
      numero_solicitud = await stringToNumber(
        radicado.dataValues.numero_solicitud
      );
      numero_solicitud = numero_solicitud + 1;
      numero_solicitud = numero_solicitud.toString();
      year = year.toString();

      const queryYearConsecutive = {
        anio_actual: year,
        numero_solicitud: numero_solicitud,
      };
      await updateSolicitud(queryYearConsecutive, id);
      
      const numeroSolicitudPad = await padLeft(numero_solicitud)

      const { 
        medio_recepcion,
        compania,
        clases_asunto,
        tipo_documental,
      } = req.body

      const opts = {
        medio_recepcion,
        compania,
        clases_asunto,
        tipo_documental,
        numeroSolicitudPad
      }
      const path = await pathRadicado()
      const createStiker = await templateRadicado(opts)

      if (createStiker) {
        const token = await alfrescoModule.CreateToken()
        const fileToUpload = fs.createReadStream(`${__dirname}/../../../temp/${numeroSolicitudPad}.pdf`)
        const result = await alfrescoModule.uploadFile(
          fileToUpload,
          path,
          config.PARENT_NODE_ID_BARCODE,
          token.entry.id
        )
        stiker = {
          nodeId: result.entry.id,
          name: result.entry.name
        } 
        
      }


      fs.unlinkSync(`${__dirname}/../../../temp/${numeroSolicitudPad}.pdf`);
      message = {
        stiker,
        consecutivo: numeroSolicitudPad
      };
    }
    res.json(message);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const stringToNumber = async (number) => {
  return parseInt(number);
};

const getRadicadoByIdInicial = async (id) => {
  try {
    const data = await consecutivos.findOne({
      where: {
        id_inicial: id,
      },
    });
    return data;
  } catch (error) {
    return false;
  }
};

const createSolicitud = async (query) => {
  try {
    const data = await consecutivos.create(query);
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const updateSolicitud = async (query, id) => {
  try {
    const data = await consecutivos.update(query, {
      where: {
        id_inicial: id,
      }
    })
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};


const pathRadicado = async () => {
  const path = moment().format('YYYY/MM/DD')
 return path
}


const padLeft = async (number) => {
  return String(number).padStart(10, '0')
}

module.exports = RadicadosCtrl;
