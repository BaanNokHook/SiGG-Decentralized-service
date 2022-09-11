import { Injectable, HttpService, Logger } from "@nestjs/common";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { map, catchError } from "rxjs/operators";
import { Agent, Scope } from "@cef-SiGG/app-jwt";
import { of } from "rxjs";
import { SessionsResponse } from "../types/sessions.response";
import { WalletTxSignRequest } from "../types/wallet.tx.request";
import JwtService from "./jwt.service";

@Injectable()
export default class WalletService {
  constructor(
    private readonly http: HttpService,
    private readonly jwt: JwtService
  ) {}

  private readonly logger = new Logger(WalletService.name);

  private readonly grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";

  private readonly baseWalletUrl = `${process.env.API}wallet/v1/`;

  /**
   * Call wallet for the user to sign a notarizatoin transaction
   * after the transaction is signed the wallet will call back on
   * the redirectURL
   * @param did decentralized identifier
   * @param hash document hash
   * @param documentDescription document description
   */
  async askForTransactionSignature(
    did: string,
    hash: string,
    documentDescription: string
  ): Promise<any> {
    this.logger.debug(
      `------ askForTransactionSignature ------did:${did}-hash:${hash}-documentDescription:${documentDescription}----`
    );

    const session = await this.login();
    if (!session) {
      return null;
    }

    const payload: WalletTxSignRequest = {
      hash,
      did,
      documentDescription,
      redirectUrl: `${process.env.APP}${process.env.EUF_PATH_NAME.slice(
        1
      )}/receive-hash`,
    };

    const transSignAPIURL = `${this.baseWalletUrl}transaction-signatures`;
    const opts: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };

    return this.http
      .post<any>(transSignAPIURL, payload, opts)
      .pipe(
        map((res: AxiosResponse<any>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.error(
            `Error : ${JSON.stringify(
              res
            )} calling: POST ${transSignAPIURL} with: ${JSON.stringify(payload)}
            response-headers: ${JSON.stringify(error.response.headers)}
            `
          );
          return of(null);
        })
      )
      .toPromise();
  }

  /**
   * Call session on wallet api to get an accessToken
   * We must first create and sign an Authn token with
   * notarisation private key
   */
  async login(): Promise<SessionsResponse> {
    this.logger.debug(`------ login wallet jwt ------`);

    const agent = new Agent(Scope.COMPONENT, process.env.APP_PRIVATE_KEY, {
      issuer: "SiGG-notary",
    });

    const payload = await agent.createRequestPayload("SiGG-wallet");

    const conf: AxiosRequestConfig = {
      headers: { "Content-Type": "application/json" },
    };

    return this.http
      .post<SessionsResponse>(`${this.baseWalletUrl}sessions`, payload, conf)
      .pipe(
        map((res: AxiosResponse<SessionsResponse>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.log(
            `Error ${JSON.stringify(res)} calling:${
              this.baseWalletUrl
            }sessions with:  ${JSON.stringify(payload)} `
          );
          return of(null);
        })
      )
      .toPromise();
  }
}
