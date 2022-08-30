import { FullVerifiableAttestation } from "./interfaces/full-verifiable-attestation";
export declare function formatVerifiableAttestation(raw: any, issuerDid: any): {
    sub: any;
    vc: {
        "@context": string[];
        id: string;
        type: string[];
        issuer: {
            id: string;
            organization: {
                id: string;
                legalIdentifier: string;
                vatIdentifier: string;
                taxIdentifier: string;
                identifier: string;
                preferredName: string;
                alternativeName: string;
                homePage: string;
                escoOrganizationType: string;
                siteLocation: string;
                hasAccreditation: {
                    targetFramework: string;
                    targetResource: string;
                };
            };
        };
        credentialSubject: {
            id: string;
            achievements: {
                id: string;
                identifier: string;
                title: string;
                description: string;
                issuedDate: string;
                partReferences: string;
                hasPart: {
                    id: string;
                    identifier: string;
                    title: string;
                    description: string;
                    issuedDate: number;
                    partReferences: string;
                    hasPart: string;
                    derivedReferences: string;
                    influencedReferences: string;
                    wasInfluencedBy: string;
                    wasDerivedFrom: {
                        id: string;
                        identifier: string;
                        title: string;
                        description: string;
                        partReferences: string;
                        derivedReferences: string;
                        hasPart: string;
                        wasDerivedFrom: string;
                        additionalNote: string;
                        grade: {
                            numericScore: string;
                            textScore: string;
                        };
                    };
                    entitlement: string;
                    learningSpecification: {
                        id: string;
                        identifier: string;
                        title: string;
                        definition: string;
                        volumeOfLearning: string;
                        learningOutcomes: {
                            id: string;
                            identifier: string;
                            title: string;
                            description: string;
                            learningOutcomeType: string;
                            reusabilityLevel: string;
                            relatedESCOSkill: string;
                        }[];
                        iscedFcode: string;
                        educationSubject: {
                            targetNotation: string;
                            targetName: string;
                        };
                        eqfLevel: string;
                        nqfLevel: string;
                        partialQualification: boolean;
                        hasAccreditation: {
                            targetFramework: string;
                            targetResource: string;
                        };
                    };
                }[];
                derivedReferences: string;
                influencedReferences: string;
                wasInfluencedBy: string;
                wasDerivedFrom: {
                    id: string;
                    identifier: string;
                    title: string;
                    description: string;
                    partReferences: string;
                    derivedReferences: string;
                    hasPart: string;
                    wasDerivedFrom: string;
                    additionalNote: string;
                    grade: {
                        numericScore: string;
                        textScore: string;
                    };
                };
                learningSpecification: {
                    id: string;
                    identifier: string;
                    title: string;
                    definition: string;
                    volumeOfLearning: string;
                    learningOutcomes: {
                        id: string;
                        identifier: string;
                        title: string;
                        description: string;
                        learningOutcomeType: string;
                        reusabilityLevel: string;
                        relatedESCOSkill: string;
                    }[];
                    iscedFcode: string;
                    educationSubject: {
                        targetNotation: string;
                        targetName: string;
                    };
                    eqfLevel: string;
                    nqfLevel: string;
                    partialQualification: boolean;
                    hasAccreditation: {
                        targetFramework: string;
                        targetResource: string;
                    };
                };
            }[];
        };
    };
};
export declare const createFullVerifiableAttestation: (vcJwt: string) => FullVerifiableAttestation;
