import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { criarCobrancaImediata } from "./index"; // Ajuste o caminho correto do módulo

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🟢 Iniciando o servidor...");

// Configuração do Certificado
const certificadoBase64 = process.env.CERTIFICATE_BASE64;
const caminhoCertificado = path.join(__dirname, "certificado.p12");

// Converte Base64 para Arquivo Temporário (caso esteja rodando no Render)
if (certificadoBase64) {
    try {
        fs.writeFileSync(caminhoCertificado, Buffer.from(certificadoBase64, "base64"));
        console.log("🔐 Certificado salvo com sucesso.");
    } catch (err) {
        console.error("❌ Erro ao salvar o certificado:", err);
    }
} else {
    console.warn("⚠️ Atenção: Variável de ambiente CERTIFICATE_BASE64 não encontrada.");
}

// Middlewares
app.use(express.json());
app.use(cors());

// Rota principal para verificar se a API está online
app.get("/", (req, res) => {
    res.json({ mensagem: "✅ API Pix está rodando!" });
});

// Rota de cobrança Pix
app.post("/cobranca", async (req, res) => {
    try {
        const { cpf, nome, valor } = req.body;
        console.log(`📌 Criando cobrança para: ${nome}, CPF: ${cpf}, Valor: R$${valor}`);

        const resultado = await criarCobrancaImediata(cpf, nome, valor);
        res.json({ sucesso: true, dados: resultado });
    } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : "Erro desconhecido";
        console.error("❌ Erro ao criar cobrança:", mensagemErro);
        res.status(500).json({ sucesso: false, erro: mensagemErro });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
