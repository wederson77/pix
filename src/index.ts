import Gerencianet from "gn-api-sdk-typescript";
import options from "./credentials";
import credentials from "./credentials";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const gerencianet = new Gerencianet(options);

function gerarTxid(): string {
    const base = "a9f3b7c1d4e6g8h6i5j0k3l7m9n6p4q";
    const index = Math.floor(Math.random() * base.length);
    const randomChar = crypto.randomBytes(1).toString("hex").charAt(0);
    return base.substring(0, index) + randomChar + base.substring(index + 1);
}

async function criarCobrancaImediata(cpf: string, nome: string, valor: string) {
    if (!cpf || !nome || !valor) {
        throw new Error("Erro: CPF, nome ou valor estão vazios.");
    }

    const txid = gerarTxid();
    const pixKey = process.env.PIX_KEY || "CHAVE_PADRÃO_AQUI";

    if (!pixKey) {
        throw new Error("Erro: PIX_KEY não está definida no .env");
    }

    const params = { txid };

    const body = {
        calendario: { expiracao: 3600 },
        devedor: { cpf, nome },
        valor: { original: valor },
        chave: pixKey,
        infoAdicionais: [
            { nome: "Plataforma", valor: "Verbo Vivo - Estudos Bíblicos" },
            { nome: "Pedido", valor: "Número do Pedido do Cliente" },
        ],
    };

    try {
        const resposta = await gerencianet.pixCreateImmediateCharge(params, body);
        const qrCode = await gerarQrCode(resposta.loc.id);
        return { txid, qrCode, resposta };
    } catch (error) {
        throw new Error("Erro ao criar cobrança: " + error);
    }
}

async function gerarQrCode(locId: number) {
    const params = { id: locId };

    try {
        const resposta = await gerencianet.pixGenerateQRCode(params);
        return resposta;
    } catch (error) {
        throw new Error("Erro ao gerar QR Code: " + error);
    }
}

export { criarCobrancaImediata };
