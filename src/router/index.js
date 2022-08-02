const radicados = require('../components/radicados/routes')


const routes = (server) => {
  server.use("/", radicados)


};

module.exports = routes;
