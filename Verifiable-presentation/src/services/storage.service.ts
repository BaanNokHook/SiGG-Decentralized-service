import { Injectable, HttpService, Logger } from "@nestjs/common";
import { Agent, Scope } from "@cef-SiGG/app-jwt";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import * as FormData from "form-data";
import * as jsonpatch from "fast-json-patch";

import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { SessionsResponse } from "../types/sessions.response";
import { StoragePostFilesResponse } from "../types/storage.post.files.response";

import { StorageMetadata } from "../types/storage.meta";
import JwtService from "./jwt.service";

@Injectable()
export default class StorageService {
  constructor(
    private readonly http: HttpService,
    private readonly jwt: JwtService
  ) {}

  private readonly logger = new Logger(StorageService.name);

  private readonly grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";

  private readonly store = "distributed";

  private readonly key_prefix = "notarisation_";

  private readonly baseStorageURL = `${process.env.API}storage/v1/`;

  private readonly storeURL = `${this.baseStorageURL}stores/${this.store}/`;

  private assertionToken = null;

  /**
   * Call session on storage api to get an accessToken
   * We must first create and sign an Authn token with
   * notarisation private key
   */
  async login(): Promise<SessionsResponse> {
    this.logger.debug(`------ login storage jwt ------`);

    const agent = new Agent(Scope.COMPONENT, process.env.APP_PRIVATE_KEY, {
      issuer: "SiGG-notary",
    });

    const payload = await agent.createRequestPayload("SiGG-storage");

    const conf: AxiosRequestConfig = {
      headers: { "Content-Type": "application/json" },
    };

    return this.http
      .post<SessionsResponse>(`${this.baseStorageURL}sessions`, payload, conf)
      .pipe(
        map((res: AxiosResponse<SessionsResponse>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.log(
            `Error ${JSON.stringify(res)} calling:${
              this.baseStorageURL
            }sessions with:  ${JSON.stringify(payload)} `
          );
          return of(null);
        })
      )
      .toPromise();
  }

  /**
   * Store a file on storage API
   * @param file file to be stored
   */
  async storeFiles(file: any): Promise<StoragePostFilesResponse> {
    this.logger.debug(
      `------ storeFiles ------${file.originalname}-----${file.size}---${file.mimetype}----`
    );

    const session = await this.login();
    if (!session) {
      return null;
    }

    const storeAPIURL = `${this.storeURL}files`;
    const form = new FormData();
    form.append("file", file.buffer, {
      filename: file.originalname,
      knownLength: file.size,
    });

    const postHeader = (form as any).getHeaders();
    const opts: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...postHeader,
      },
    };
    this.logger.log(`CALLING POST ${JSON.stringify(opts)} `);

    return this.http
      .post<StoragePostFilesResponse>(storeAPIURL, form, opts)
      .pipe(
        map((res: AxiosResponse<StoragePostFilesResponse>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.log(
            `Error : ${JSON.stringify(res)} calling: POST ${storeAPIURL}
            response-headers: ${JSON.stringify(error.response.headers)}
            `
          );
          return of(null);
        })
      )
      .toPromise();
  }

  /**
   * Get a file on storage API by its hash
   * @param hash file hash
   */
  async getFile(hash: string): Promise<any> {
    this.logger.debug(`----- getFile ------${hash}------`);

    const session = await this.login();
    if (!session) {
      return null;
    }

    const storeAPIURL = `${this.storeURL}files/${hash}`;

    const opts: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      responseType: "blob",
    };
    this.logger.debug(
      `CALLING GET: files/${hash} with:${JSON.stringify(opts)} `
    );

    return this.http
      .get<any>(storeAPIURL, opts)
      .pipe(
        map((res: AxiosResponse<any>) => res),
        catchError((error) => {
          this.logger.error(
            `Error : ${error.response.status} ${
              error.response.statusText
            } calling: GET ${storeAPIURL} with:${JSON.stringify(opts)}
            response: ${JSON.stringify(error.response.headers)}
            `
          );
          return of(null);
        })
      )
      .toPromise();
  }

  /**
   * store metadata linked to a document as a key-value pair
   * @param metadata meta data related to the stored document
   */
  async storeKeyValue(metadata: StorageMetadata): Promise<any> {
    this.logger.debug(
      `------ storeKeyValue --with:${JSON.stringify(metadata)}------`
    );

    const session = await this.login();
    if (!session) {
      return null;
    }

    const storeFilePath = `${this.storeURL}key-values/${this.key_prefix}${metadata.hash}`;

    const opts: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };
    this.logger.log(`Calling  key-values ${storeFilePath} `);

    return this.http
      .put<any>(storeFilePath, metadata, opts)
      .pipe(
        map((res: AxiosResponse<any>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.error(
            `Error : ${JSON.stringify(
              res
            )} calling: ${storeFilePath} with: ${JSON.stringify(metadata)}
            response: ${JSON.stringify(error.response.headers)}
            `
          );
          return of(null);
        })
      )
      .toPromise();
  }

  /**
   * Get metadata related to a document in the storage key-value API
   * @param hash hash of the document
   */
  async getKeyValue(hash: string): Promise<StorageMetadata> {
    this.logger.debug(`----- getKeyValue -----`);

    const session = await this.login();

    if (!session) {
      return null;
    }

    const storeFilePath = `${this.storeURL}key-values/${this.key_prefix}${hash}`;

    const opts: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };
    this.logger.log(`Calling GET key-values ${storeFilePath} `);

    return this.http
      .get<StorageMetadata>(storeFilePath, opts)
      .pipe(
        map((res: AxiosResponse<StorageMetadata>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.error(
            `Error : ${JSON.stringify(res)} calling: GET ${storeFilePath}
            response: ${JSON.stringify(error.response.headers)}
            `
          );
          return of(null);
        })
      )
      .toPromise();
  }

  /**
   * Patch metadata related to a document in the storage key-value API
   * It will create a Jsonpatch object with the difference between the provided
   * metadata and the one already stored
   * @param metadata new metadata of the document
   */
  async patchKeyValue(metadata: StorageMetadata): Promise<any> {
    this.logger.debug(`patchKeyValue --with:${JSON.stringify(metadata)}`);

    const session = await this.login();
    if (!session) {
      return null;
    }

    const storeFilePath = `${this.storeURL}key-values/${this.key_prefix}${metadata.hash}`;

    const currentMetadata: StorageMetadata = await this.getKeyValue(
      metadata.hash
    );
    const diff = jsonpatch.compare(currentMetadata, metadata);

    const opts: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    };
    this.logger.log(`Calling PATCH key-values ${storeFilePath} `);

    return this.http
      .patch<any>(storeFilePath, diff, opts)
      .pipe(
        map((res: AxiosResponse<any>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.error(
            `Error : ${JSON.stringify(
              res
            )} calling: PATCH ${storeFilePath} with: ${JSON.stringify(metadata)}
              response: ${JSON.stringify(error.response.headers)}
              `
          );
          return of(null);
        })
      )
      .toPromise();
  }
}
