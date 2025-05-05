const sockSingleton = require("../../services/SockSingleton/sockSingleton");

module.exports = sendMessageToContact = async (phonenNumber, message) => {
  //5493876147003@s.whatsapp.net
  try {
    const userId = `${phonenNumber}@s.whatsapp.net`;
    const sock = sockSingleton.getSock();
    sock.sendMessage(userId, {
      text: message,
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};
