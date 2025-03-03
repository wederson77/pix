"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarCobrancaImediata = criarCobrancaImediata;
const gn_api_sdk_typescript_1 = __importDefault(require("gn-api-sdk-typescript"));
const credentials_1 = __importDefault(require("./credentials"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const gerencianet = new gn_api_sdk_typescript_1.default(credentials_1.default);
function gerarTxid() {
    const base = "a9f3b7c1d4e6g8h6i5j0k3l7m9n6p4q";
    const index = Math.floor(Math.random() * base.length);
    const randomChar = crypto_1.default.randomBytes(1).toString("hex").charAt(0);
    return base.substring(0, index) + randomChar + base.substring(index + 1);
}
function criarCobrancaImediata(cpf, nome, valor) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const resposta = yield gerencianet.pixCreateImmediateCharge(params, body);
            const qrCode = yield gerarQrCode(resposta.loc.id);
            return { txid, qrCode, resposta };
        }
        catch (error) {
            throw new Error("Erro ao criar cobrança: " + error);
        }
    });
}
function gerarQrCode(locId) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = { id: locId };
        try {
            const resposta = yield gerencianet.pixGenerateQRCode(params);
            return resposta;
        }
        catch (error) {
            throw new Error("Erro ao gerar QR Code: " + error);
        }
    });
}
