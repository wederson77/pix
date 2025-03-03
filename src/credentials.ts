import dotenv from "dotenv";
dotenv.config();

const credentials = {
    sandbox: process.env.SANDBOX === "true",
    client_id: process.env.CLIENT_ID || "",
    client_secret: process.env.CLIENT_SECRET || "",
    certificate: process.env.CERTIFICATE_PATH || "",
};

export default credentials;
