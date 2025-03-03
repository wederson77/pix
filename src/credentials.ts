import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let certificatePath = process.env.CERTIFICATE_PATH || "";
const certificateBase64 = process.env.CERTIFICATE_BASE64;

// Se estivermos no Render, criamos um arquivo temporário com o certificado Base64
if (certificateBase64) {
    const tempPath = path.join(__dirname, "certificado_temp.p12");
    fs.writeFileSync(tempPath, Buffer.from(certificateBase64, "base64"));
    certificatePath = tempPath;
    console.log("🔐 Certificado temporário criado com sucesso.");
}

const credentials = {
    sandbox: process.env.SANDBOX === "true",
    client_id: process.env.CLIENT_ID || "",
    client_secret: process.env.CLIENT_SECRET || "",
    certificate: certificatePath,
};

export default credentials;
