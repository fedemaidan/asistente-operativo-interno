const { EsperarRespuestaSteps } = require("./EsperarRespuestaSteps");

const EsperarRespuestaFlow = {
  async start(userId, data, sock) {
    //await sock.sendMessage(userId, { text: '📝 Recopilando datos de la hoja de ruta deseada \n Listando datos detectados:' });

    if (userId != null) {
      if (typeof EsperarRespuestaSteps["actualizarEstadoStep"] === "function") {
        await EsperarRespuestaSteps["actualizarEstadoStep"](userId, data);
      } else {
        console.log("El step solicitado no existe");
      }
    } else {
      console.log("Ocurrio un error con los datos");
    }
  },

  async Handle(userId, message, currentStep, sock, messageType) {
    if (userId != null && sock != null) {
      if (typeof EsperarRespuestaSteps[currentStep] === "function") {
        await EsperarRespuestaSteps[currentStep](userId, message);
      } else {
        console.log("El step solicitado no existe");
      }
    } else {
      console.log("Ocurrio un error con los datos");
    }
  },
};
module.exports = EsperarRespuestaFlow;
