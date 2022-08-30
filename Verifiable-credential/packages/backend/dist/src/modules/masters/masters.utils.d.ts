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
                partReferences: any;
                hasPart: ({
                    id: string;
                    identifier: string;
                    title: string;
                    description: string;
                    issuedDate: number;
                    partReferences: any;
                    hasPart: any;
                    derivedReferences: any;
                    influencedReferences: any;
                    wasInfluencedBy: any;
                    wasDerivedFrom: {
                        id: string;
                        identifier: string;
                        title: string;
                        description: any;
                        partReferences: any;
                        derivedReferences: any;
                        hasPart: any;
                        wasDerivedFrom: any;
                        assessedBy: any;
                        additionalNote: string;
                        grade: {
                            numericScore: string;
                        };
                        issuedDate: string;
                        specifiedby: any;
                    };
                    entitlement: any;
                    learningSpecification: {
                        id: string;
                        identifier: string;
                        title: string;
                        definition: string;
                        volumeOfLearning: string;
                        learningOutcomes: any;
                        iscedFcode: string;
                        educationSubject: {
                            targetNotation: string;
                            targetName: string;
                        };
                        ectsCreditPoints: number;
                        language?: undefined;
                    };
                } | {
                    id: string;
                    identifier: string;
                    title: string;
                    description: string;
                    issuedDate: string;
                    partReferences: any;
                    hasPart: any;
                    derivedReferences: any;
                    influencedReferences: any;
                    wasInfluencedBy: any;
                    wasDerivedFrom: {
                        id: string;
                        identifier: string;
                        title: string;
                        description: any;
                        partReferences: any;
                        derivedReferences: any;
                        hasPart: any;
                        wasDerivedFrom: any;
                        assessedBy: any;
                        additionalNote: string;
                        grade: {
                            numericScore: string;
                        };
                        issuedDate: string;
                        specifiedby: any;
                    };
                    entitlement: any;
                    learningSpecification: {
                        id: string;
                        identifier: string;
                        title: string;
                        definition: string;
                        volumeOfLearning: string;
                        learningOutcomes: {
                            id: string;
                            identifier: any;
                            title: string;
                            description: any;
                            learningOutcomeType: string;
                            reusabilityLevel: any;
                            relatedESCOSkill: {
                                target: string;
                            };
                        }[];
                        iscedFcode: string;
                        ectsCreditPoints: number;
                        language: {
                            content: string;
                            uri: string;
                        };
                        educationSubject?: undefined;
                    };
                })[];
                derivedReferences: any;
                influencedReferences: any;
                wasInfluencedBy: any;
                wasDerivedFrom: {
                    id: string;
                    identifier: string;
                    title: string;
                    description: any;
                    partReferences: any;
                    derivedReferences: any;
                    hasPart: any;
                    wasDerivedFrom: any;
                    assessedBy: any;
                    additionalNote: string;
                    grade: {
                        textScore: string;
                    };
                    issuedDate: string;
                    specifiedby: {
                        id: string;
                        identifier: string;
                        assesmentType: string;
                        title: string;
                        description: string;
                        gradingscheme: {
                            id: string;
                            identifier: string;
                            title: string;
                            description: string;
                        };
                    };
                };
                learningSpecification: {
                    id: string;
                    identifier: {
                        IdentifierSchemeAgencyName: string;
                        Content: string;
                    };
                    title: string;
                    definition: any;
                    volumeOfLearning: string;
                    learningOutcomes: {
                        id: string;
                        identifier: any;
                        title: string;
                        description: any;
                        learningOutcomeType: string;
                        reusabilityLevel: any;
                        relatedESCOSkill: any;
                    }[];
                    iscedFcode: string;
                    ectsCreditPoints: number;
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
