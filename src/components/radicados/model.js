const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const Consecutivos = sequelize.define('consecutivos', {
  id_inicial: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
  },

  anio_actual: {
    type: DataTypes.CHAR(16),
  },
  numero_solicitud: {
    type: DataTypes.CHAR(32),
  }
}, {
  timestamps: false,
});


module.exports = Consecutivos