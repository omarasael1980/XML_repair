import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import xml2js from "xml2js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const modifyXml = async (req, res) => {
  try {
    // Verificar si se recibió un archivo
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió el archivo" });
    }
    // Verificar si el archivo es de tipo XML
    if (!req.file.mimetype.includes("xml")) {
      return res.status(400).json({ message: "El archivo no es XML" });
    }

    // Leer el contenido del archivo XML
    const filePath = path.join(__dirname, `../upload/${req.file.filename}`);
    const xmlContent = fs.readFileSync(filePath, "utf8");

    // Parsear el contenido del XML
    xml2js.parseString(xmlContent, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error("Error al parsear XML:", err);
        return res
          .status(500)
          .json({ message: "Error al procesar el archivo" });
      }

      // Acceso a Mercancias
      const mercancias =
        result?.["CARTAPORTEMX_V2"]?.Complemento?.["cartaporte31:CartaPorte"]?.[
          "cartaporte31:Mercancias"
        ]?.["cartaporte31:Mercancia"];

      // Asegúrate de que mercancias sea un array
      if (
        !mercancias ||
        (Array.isArray(mercancias) && mercancias.length === 0)
      ) {
        console.error(
          "No se encontraron nodos <cartaporte31:Mercancia> en el XML."
        );
        return res.status(400).json({ message: "Estructura XML inesperada" });
      }

      // Asegúrate de que mercanciasArray es un array
      const mercanciasArray = Array.isArray(mercancias)
        ? mercancias
        : [mercancias];

      mercanciasArray.forEach((mercancia) => {
        const documentacion = mercancia["cartaporte31:DocumentacionAduanera"];

        mercanciasArray.forEach((mercancia) => {
          const documentacion = mercancia["cartaporte31:DocumentacionAduanera"];

          if (documentacion) {
            // Acceder a los atributos de DocumentacionAduanera
            const tipoDocumento = documentacion["$"]?.TipoDocumento || "";
            const numPedimento = documentacion["$"]?.NumPedimento || "";
            const rfcImpo = documentacion["$"]?.RFCImpo || "";

            // Combinar los atributos de DocumentacionAduanera con Mercancia
            const updatedAttributes = {
              ...mercancia["$"], // Mantener atributos existentes de Mercancia
              TipoDocumento: tipoDocumento, // Asignar valor extraído
              NumPedimento: numPedimento, // Asignar valor extraído
              RFCImpo: rfcImpo, // Asignar valor extraído
            };

            // Reemplazar los atributos de Mercancia con los actualizados
            mercancia["$"] = updatedAttributes;

            // Mantener las propiedades de la mercancía y eliminar DocumentacionAduanera
            delete mercancia["cartaporte31:DocumentacionAduanera"];
          }
        });
      });

      // Convertir el objeto JSON de vuelta a XML
      const builder = new xml2js.Builder();
      const modifiedXml = builder.buildObject(result);

      // Crear un nuevo archivo con el contenido modificado
      const modifiedFilePath = path.join(
        __dirname,
        "../upload",
        "modified.xml"
      );
      fs.writeFile(modifiedFilePath, modifiedXml, (err) => {
        if (err) {
          console.error("Error al guardar el archivo modificado:", err);
          return res
            .status(500)
            .json({ message: "Error al procesar el archivo" });
        }

        // Enviar el archivo modificado como respuesta
        res.download(modifiedFilePath, "modified.xml", (err) => {
          if (err) {
            console.error("Error al enviar el archivo:", err);
            return res
              .status(500)
              .json({ message: "Error al enviar el archivo" });
          }

          // Opcional: eliminar el archivo modificado después de enviarlo
          fs.unlink(modifiedFilePath, (err) => {
            if (err) {
              console.error("Error al eliminar el archivo modificado:", err);
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
