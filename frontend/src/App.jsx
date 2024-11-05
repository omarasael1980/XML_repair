import { useState, useRef } from "react";
import AxiosClient from "./helpers/ClienteAxios";
import swal from "sweetalert2";

function App() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      swal.fire("Error", "Por favor, selecciona un archivo XML.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("xml", file);

    try {
      const response = await AxiosClient.post("/work", formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        await swal.fire({
          title: "Archivo XML procesado",
          text: "El archivo XML fue procesado y se ha descargado exitosamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        const blob = new Blob([response.data], { type: "application/xml" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `updated_${file.name}`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Limpiar el input
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <nav className="flex justify-between items-center w-full h-32 px-8 bg-gradient-to-b from-[#2C3E50] to-[#364F6B] shadow-md">
        <div className="relative">
          <img
            src="./ktr.jpg"
            className="h-28 w-28 rounded-full ring-4 ring-[#FF6B8A] shadow-2xl transform hover:scale-105 transition-transform"
            alt="ktr"
          />
        </div>
        <h1 className=" text-3xl font-bold text-[#E0E0E0]">Reparador de XML</h1>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="text-2xl mb-8 flex flex-col justify-center items-center w-2/3 self-center mt-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl p-6 flex flex-col justify-center items-center bg-white rounded-lg shadow-lg gap-6"
          >
            <label className="text-3xl mt-4" htmlFor="xml">
              Selecciona el{" "}
              <span className="text-[#2C3E50] font-bold">XML:</span>
            </label>
            <input
              className="w-full border border-gray-300 p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              name="xml"
              id="xml"
              accept=".xml"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <input
              className="w-full hover:bg-[#FFB6C1] text-white font-semibold bg-[#2C3E50] transition-colors rounded-lg p-3 cursor-pointer"
              type="submit"
              value="Repara XML"
            />
          </form>
        </div>
      </main>

      <footer className="bg-[#2C3E50] h-16 flex items-center justify-center shadow-inner">
        <p className="text-white font-semibold">
          © 2024 HMDev - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}

export default App;
