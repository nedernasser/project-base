'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WatchList', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      documentType: {
        type: Sequelize.ENUM('CNPJ', 'CPF'),
        allowNull: false
      },
      document: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true
      },
      reason: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WatchList')
  }
}
