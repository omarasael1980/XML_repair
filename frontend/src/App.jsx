import { useState } from "react";
import AxiosClient from "./helpers/ClienteAxios";
import swal from "sweetalert2";

function App() {
  const [file, setFile] = useState(null);
  console.log(file);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      swal.fire("Error", "Por favor, selecciona un archivo XML.", "error");
      return;
    }

    // Crear un objeto FormData y agregar el archivo
    const formData = new FormData();
    formData.append("xml", file);

    try {
      // Enviar el FormData al backend
      const response = await AxiosClient.post("/work", formData, {
        responseType: "blob", // Esperar una respuesta de tipo blob
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Mostrar un mensaje de éxito
        await swal.fire({
          title: "Archivo XML procesado",
          text: "El archivo XML fue procesado y se ha descargado exitosamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        // Crear un blob y una URL para el archivo descargable
        const blob = new Blob([response.data], { type: "application/xml" });
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace para la descarga y simular un clic
        const a = document.createElement("a");
        a.href = url;
        a.download = `updated_${file.name}`; // Nombre del archivo descargado
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al enviar el archivo.",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      swal.fire({
        icon: "error",
        title: "Hubo un problema al enviar el archivo.",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-dvh bg-gray-100 ">
      <div className="text-2xl mb-8 flex flex-col justify-center items-center w-2/3 self-center h-2/3 mt-10">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-center items-center bg-white rounded-md shadow-md gap-4"
        >
          <label className="text-2xl font-bold mt-8" htmlFor="xml">
            Selecciona el <span className="text-blue-700">XML:</span>
          </label>
          <input
            className="w-1/2 border border-gray-400 p-2 bg-gray-100 rounded-md"
            type="file"
            name="xml"
            id="xml"
            accept=".xml"
            onChange={handleFileChange}
          />
          <input
            className="w-1/2 bg-green-500 text-white hover:bg-green-700 transition-colors rounded-md p-2 mb-10"
            type="submit"
            value="Arreglar XML"
          />
        </form>
      </div>
    </div>
  );
}

export default App;
