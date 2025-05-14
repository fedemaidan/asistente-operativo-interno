const FlowManager = require("../../../FlowControl/FlowManager");
const detectarEstado = require("../../../Utiles/Chatgpt/detectarEstado");
const { actualizarEstado } = require("../../../Utiles/Google/Sheets/contactos");

module.exports = async function actualizarEstadoStep(userId, message, sock) {
  if (!FlowManager.userFlows[userId].flowData) {
    FlowManager.userFlows[userId].flowData = [];
    const messagesArray = FlowManager.userFlows[userId].flowData;
    messagesArray.push(message);

    setTimeout(async () => {
      const estado = await detectarEstado(messagesArray);
      //updateRow si no lo encuentra no hace nada o tira error?
      await actualizarEstado(estado);
      FlowManager.resetFlow(userId);
    }, 10 * 60 * 1000);
  } else {
    FlowManager.userFlows[userId].flowData.push(message);
  }
};
