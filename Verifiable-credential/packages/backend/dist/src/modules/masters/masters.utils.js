"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFullVerifiableAttestation = exports.formatVerifiableAttestation = void 0;
const jwt_utils_1 = require("../../common/utils/jwt.utils");
const constants_1 = require("./constants");
const master_diploma_structure_json_1 = __importDefault(require("./master-diploma-structure.json"));
function formatVerifiableAttestation(raw, issuerDid) {
    if (!raw || !issuerDid) {
        throw new Error("Missing parameters in formatVerifiableId function");
    }
    const verifiableId = Object.assign({}, master_diploma_structure_json_1.default);
    verifiableId.credentialSubject.id = raw.did;
    verifiableId.issuer.id = issuerDid;
    const verifiableIdCredentialPayload = {
        sub: raw.did,
        vc: {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://EBSI-WEBSITE.EU/schemas/vc/2019/v1#",
                "https://EBSI-WEBSITE.EU/schemas/eidas/2019/v1#",
            ],
            id: verifiableId.id,
            type: verifiableId.type,
            issuer: verifiableId.issuer,
            credentialSubject: verifiableId.credentialSubject,
        },
    };
    return verifiableIdCredentialPayload;
}
exports.formatVerifiableAttestation = formatVerifiableAttestation;
exports.createFullVerifiableAttestation = (vcJwt) => {
    const decodedVc = jwt_utils_1.decodeToken(vcJwt);
    const { iat, iss, vc } = decodedVc;
    if (!iat)
        throw Error("Error processing JWT iat");
    const issuanceDate = new Date(iat * 1000).toISOString();
    return {
        "@context": vc["@context"],
        id: vc.id,
        type: vc.type,
        issuer: iss,
        issuanceDate,
        credentialSubject: vc.credentialSubject,
        proof: {
            type: constants_1.DEFAULT_EIDAS_PROOF_TYPE,
            created: issuanceDate,
            proofPurpose: constants_1.DEFAULT_PROOF_PURPOSE,
            verificationMethod: iss + constants_1.DEFAULT_EIDAS_VERIFICATION_METHOD,
            jws: vcJwt,
        },
    };
};
//# sourceMappingURL=masters.utils.js.map