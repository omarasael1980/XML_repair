import dotenv from "dotenv";
import express from "express";
import workRoutes from "./routes/workRoutes.js";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());

// Configuración de CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Configuración de `multer` para guardar archivos en la carpeta `uploads`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); // Carpeta para archivos temporales
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Ruta principal con `upload.single`
app.use("/api/v1/work", upload.single("xml"), workRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
