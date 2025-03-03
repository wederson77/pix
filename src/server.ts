import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { criarCobrancaImediata } from "./index";

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("🟢 Iniciando o servidor...");

// Middlewares
app.use(express.json());
app.use(cors());

// Rota principal para verificar se a API está online
app.get("/", (req, res) => {
    res.json({ mensagem: "API Pix está rodando!" });
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
