import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const UsuarioSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellidos: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
//hashear password
UsuarioSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});
//comparar password
UsuarioSchema.methods.comparePassword = async function (passEnetered) {
  return await bcrypt.compare(passEnetered, this.password);
};
const Usuario = mongoose.model("Usuario", UsuarioSchema);
export default Usuario;
