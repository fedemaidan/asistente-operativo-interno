const { getByChatGpt4o } = require("../../services/Chatgpt/Base");

module.exports = async function detectarEstado(messages) {
  if (messages.length === 0) {
    console.log("No hay mensajes para procesar.");
    return null;
  }

  try {
    const conversacionCompleta = messages.join("\n");

    const prompt = `
Analiza los siguientes mensajes de un cliente y determina su estado según estos criterios:
- "INTERESADO": El cliente muestra interés en el producto/servicio, hace preguntas específicas, solicita más información o demuestra intención de compra.
- "NO_INTERESADO": El cliente rechaza explícitamente la oferta, muestra desinterés o pide no ser contactado nuevamente.

Mensajes del cliente:
${conversacionCompleta}

Responde ÚNICAMENTE con uno de estos estados: "INTERESADO", o "NO_INTERESADO".
`;
    const response = await getByChatGpt4o(prompt);
    const respuesta = JSON.parse(response);

    if (respuesta.hasOwnProperty("json_data")) {
      return respuesta.json_data;
    } else {
      return respuesta;
    }
  } catch (error) {
    console.error("Error al detectar estado:", error.message);
    return null;
  }
};
