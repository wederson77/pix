import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let certificatePath = process.env.CERTIFICATE_PATH || "";
const certificateBase64 = process.env.CERTIFICATE_BASE64;

if (certificateBase64) {
    try {
        const tempPath = path.join("/tmp", "certificado_temp.p12"); // Diretório correto para Render
        fs.writeFileSync(tempPath, Buffer.from(certificateBase64, "base64"));
        certificatePath = tempPath;
        console.log("🔐 Certificado salvo com sucesso em:", tempPath);
    } catch (err) {
        console.error("❌ Erro ao criar o certificado:", err);
    }
} else {
    console.warn("⚠️ Variável CERTIFICATE_BASE64 não encontrada!");
}

const credentials = {
    sandbox: process.env.SANDBOX === "true",
    client_id: process.env.CLIENT_ID || "",
    client_secret: process.env.CLIENT_SECRET || "",
    certificate: certificatePath,
};

export default credentials;
