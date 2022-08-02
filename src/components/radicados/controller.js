const consecutivos = require('./model');
const templateRadicado = require('../../libs/radicado')
const alfresco = require('../../libs/alfresco')
const RadicadosCtrl = {};

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
  let message;
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
        numero_solicitud
      }

      const createStiker = await templateRadicado(opts)
      if (createStiker) {
        alfrescoModule.uploadFile()
      }

      message = {
        consecutivo: numero_solicitud
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

module.exports = RadicadosCtrl;
