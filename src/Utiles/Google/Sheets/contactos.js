const { checkIfSheetExists } = require("../../../services/google/General");

require("dotenv").config();

SHEET_ID = process.env.SHEET_ID;
SHEET_NAME = "Portal de Arquitectos";
RANGE = `${SHEET_NAME}!A1:Z10000`;

async function getContactosFromSheet() {
  try {
    const exists = await checkIfSheetExists(SHEET_ID, SHEET_NAME);

    if (!exists) {
      throw new Error(`La hoja "${SHEET_NAME}" no existe.`);
    }

    const dataContactos = await getRowsValues(
      GOOGLE_SHEET_ID,
      SHEET_NAME,
      "A2:M1000"
    );
  } catch (error) {
    console.error("Error al obtener contactos de la hoja:", error);
  }
}

module.exports = {
  getContactosFromSheet,
};
