require("dotenv").config();
const connectToWhatsApp = require("./src/services/Mensajes/whatsapp");
const getMessageType = require("./src/services/Mensajes/GetType");
const messageResponder = require("./src/services/Mensajes/messageResponder");
const socketSingleton = require("./src/services/SockSingleton/sockSingleton");
const sendMessageToContact = require("./src/Utiles/Mensajes/sendMessageToContact");
const {
  getContactosFromSheet,
  updateContactoRow,
} = require("./src/Utiles/Google/Sheets/contactos");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const enviarContactosEnFrio = async () => {
  try {
    const contactos = await getContactosFromSheet();

    const fechaActual = new Date();
    const horaActual = fechaActual.getHours();

    const diaActual = fechaActual.getDate().toString().padStart(2, "0");
    const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const anioActual = fechaActual.getFullYear();
    const fechaFormateada = `${diaActual}/${mesActual}/${anioActual}`;

    const contactosPendientes = contactos.filter((contacto) => {
      const esPendiente =
        contacto.estado === "Pendiente" || contacto.estado === "";

      let coincideHora = true;
      if (contacto.hora) {
        const horaContacto = parseInt(contacto.hora);
        if (!isNaN(horaContacto)) {
          coincideHora = horaContacto === horaActual;
        }
      }

      let coincideFecha = true;
      if (contacto.fecha) {
        coincideFecha = contacto.fecha === fechaFormateada;
      }

      return esPendiente && coincideHora && coincideFecha;
    });

    if (contactosPendientes.length === 0) {
      console.log("No hay contactos pendientes para enviar en esta hora.");
      return;
    }

    for (const contacto of contactosPendientes) {
      console.log("CONTACTO PENDIENTE", contacto.numero, contacto.mensaje);
      await sendMessageToContact(contacto.numero, contacto.mensaje);
      contacto.estado = "Contactado";
      await updateContactoRow(contacto);

      const waitTime = Math.floor(Math.random() * (180000 - 60000) + 60000);
      console.log(
        `Esperando ${Math.round(
          waitTime / 1000
        )} segundos antes del siguiente mensaje...`
      );

      await sleep(waitTime);
    }
  } catch (error) {
    console.error("Error al obtener contactos de la hoja de cálculo:", error);
    return;
  }
};

const startBot = async () => {
  const sock = await connectToWhatsApp();
  await socketSingleton.setSock(sock);

  sock.ev.on("messages.upsert", async (message) => {
    const msg = message.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const messageType = getMessageType(msg.message);

    await messageResponder(messageType, msg, sock, sender);
  });

  setInterval(() => console.log("Keep-alive"), 5 * 60 * 1000);
  setInterval(
    async () => await sock.sendPresenceUpdate("available"),
    10 * 60 * 1000
  );

  enviarContactosEnFrio();
  setInterval(() => {
    enviarContactosEnFrio();
  }, 1000 * 60 * 60);
};

startBot();
