const {
  getContactosFromSheet,
  updateContactoRow,
} = require("../Google/Sheets/contactos");
const sendMessageToContact = require("./sendMessageToContact");
const { DateTime } = require("luxon");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const enviarContactosEnFrio = async () => {
  console.log("ENVIANDO CONTACTOS EN FRIO");
  try {
    const contactos = await getContactosFromSheet();
    console.log("CONTACTOS", contactos);
    const fechaActual = DateTime.now().setZone(
      "America/Argentina/Buenos_Aires"
    );
    const horaActual = fechaActual.hour;
    const fechaFormateada = fechaActual.toFormat("dd/MM/yyyy");

    console.log("FECHA FORMATEADA", fechaFormateada);
    console.log("HORA ACTUAL", horaActual);

    const contactosPendientes = contactos.filter((contacto) => {
      const esPendiente =
        contacto.estado === "Pendiente" || contacto.estado === "";

      let coincideHora = false;
      if (contacto.hora) {
        const horaContacto = parseInt(contacto.hora);
        coincideHora = horaContacto === horaActual;
      }

      let coincideFecha = false;
      if (contacto.fecha) {
        coincideFecha = contacto.fecha === fechaFormateada;
      }

      return (
        esPendiente &&
        coincideHora &&
        coincideFecha &&
        contacto.numero &&
        contacto.mensaje
      );
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

module.exports = enviarContactosEnFrio;
