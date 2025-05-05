const {
  checkIfSheetExists,
  updateRow,
  getRowsValues,
} = require("../../../services/google/General");

require("dotenv").config();

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Contactos en Frio";
const RANGE = `${SHEET_NAME}!A1:Z10000`;

const parseContactos = (arr) =>
  arr.map((row) => ({
    estado: row[0],
    fecha: row[1],
    hora: row[2],
    nombre: row[3],
    mail: row[4],
    numero: row[5],
    web: row[6],
    dataExtra: row[7],
    mensaje: row[8],
  }));

const getArrayToSheetGeneral = (contacto) => {
  const values = [
    contacto.estado,
    contacto.fecha,
    contacto.hora,
    contacto.nombre,
    contacto.mail,
    contacto.numero,
    contacto.web,
    contacto.dataExtra,
    contacto.mensaje,
  ];
  return values;
};

async function getContactosFromSheet() {
  try {
    const exists = await checkIfSheetExists(GOOGLE_SHEET_ID, SHEET_NAME);

    if (!exists) {
      throw new Error(`La hoja "${SHEET_NAME}" no existe.`);
    }

    const dataContactosRaw = await getRowsValues(
      GOOGLE_SHEET_ID,
      SHEET_NAME,
      "A2:M1000"
    );
    console.log("Data Contactos Raw", dataContactosRaw);

    const dataContactos = parseContactos(dataContactosRaw);
    console.log("Data Contactos", dataContactos);
    return dataContactos;
  } catch (error) {
    console.error("Error al obtener contactos de la hoja:", error);
  }
}

async function updateContactoRow(contacto) {
  try {
    const values = getArrayToSheetGeneral(contacto);

    await updateRow(GOOGLE_SHEET_ID, values, RANGE, 5, contacto.numero);
  } catch (error) {
    console.error("Error al actualizar la fila del contacto:", error);
  }
}

module.exports = {
  getContactosFromSheet,
  updateContactoRow,
};
