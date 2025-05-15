const FlowManager = require("../../../FlowControl/FlowManager");
const detectarEstado = require("../../../Utiles/Chatgpt/detectarEstado");
const { actualizarEstado } = require("../../../Utiles/Google/Sheets/contactos");

module.exports = async function actualizarEstadoStep(userId, message, sock) {
  const phoneNumber = userId.split("@")[0];
  const { estado } = await detectarEstado(message);

  if (!estado || estado == "-") {
    FlowManager.resetFlow(userId);
  } else {
    await actualizarEstado(estado, phoneNumber);
    FlowManager.resetFlow(userId);
  }
};
