import {
  Render,
  Controller,
  Get,
  Logger,
  UseGuards,
  Post,
  Request,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  Res,
  Query,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";

import * as express from "express";

import { FileInterceptor } from "@nestjs/platform-express";
import { utils } from "ethers";

import validationPipe from "./shared/validation.pipe";
import CredentialDto from "./types/credentials.dto";
import VerifyDto from "./types/verify.dto";
import HttpUnauthorizedExceptionFilter from "./filter/http-unauthorized-exception.filter";
import HttpForbiddenExceptionFilter from "./filter/http-forbidden-exception.filter";
import JwtService from "./services/jwt.service";
import StorageService from "./services/storage.service";
import JwtGuard from "./guards/jwt.guard";
import { StorageMetadata, FileMetadataStatus } from "./types/storage.meta";
import DocumentDto from "./types/document.dto";
import TimestampService from "./services/timestamp.service";
import WalletService from "./services/wallet.service";
import HttpBadRequestExceptionFilter from "./filter/http-badrequest-exception.filter";

@ApiTags("notarisation")
@Controller()
export default class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private jwtService: JwtService,
    private storageService: StorageService,
    private timestampService: TimestampService,
    private walletService: WalletService
  ) {}

  renderOpt = {
    PUBLIC_URL: process.env.EUF_PUBLIC_URL,
    APP_URL: process.env.APP,
    title: process.env.TITLE || "Notarisation Sample App",
    wallet: process.env.EUF_WALLET,
    walletNotifications: process.env.EUF_WALLET_NOTIFICATIONS,
    pathname: process.env.EUF_PATH_NAME,
    fileupload: process.env.EUF_FILE_UPLOAD,
    document: process.env.EUF_DOCUMENT,
    verify: process.env.EUF_VERIFY,
    verifyfile: process.env.EUF_VERIFY_FILE,
    version: `V ${process.env.EUF_VERSION} - ${process.env.NODE_ENV}`,
  };

  @ApiOperation({
    summary: "health endpoint",
    description: `will return ok if api is up`,
  })
  @Get("health")
  health() {
    this.logger.debug("GET health/  ");
    return "ok";
  }

  @ApiOperation({
    summary: "return notarisation html",
    description: `App rendering with handlebar template`,
  })
  @Get()
  @Render("index")
  root(@Req() req: Request) {
    this.logger.log("GET notarisation/  ");
    this.logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
    return {
      ...this.renderOpt,
    };
  }

  @ApiOperation({
    summary: "get the jwt and did from storage for verification",
    description: `It will redirect if not valid`,
  })
  @Post()
  @UseGuards(JwtGuard)
  @UseFilters(new HttpUnauthorizedExceptionFilter())
  @UseFilters(new HttpForbiddenExceptionFilter())
  @UseFilters(new HttpBadRequestExceptionFilter())
  async home(
    @Body(validationPipe)
    @Body()
    data: CredentialDto
  ): Promise<string> {
    this.logger.log("POST notarisation/  ");
    this.logger.debug(`data: ${JSON.stringify(data)}`);
    return "ok";
  }

  private async verify(docHash: string): Promise<any> {
    const res = {
      message: null,
      verified: true, // actually this display the verifying info div
      ...this.renderOpt,
    };
    let hash = docHash;
    if (!docHash.startsWith("0x")) {
      hash = `0x${docHash}`;
    }
    // check if dochash is a real hash
    if (!utils.isHexString(hash)) {
      return {
        ...res,
        message: "Hash is not correct",
        signed: false,
        ok: false,
      };
    }

    // Check if file already anchored on the ledger
    const tsRes = await this.timestampService.getTimestamp(hash);

    // Record exists
    if (tsRes) {
      return {
        ...res,
        signed: true,
        ok: true,
        info: {
          hash: tsRes.hash,
          timestamp: tsRes.timestamp,
          ledgerHash: tsRes.txHash,
          registeredBy: tsRes.registeredBy,
        },
      };
    }

    return {
      ...res,
      signed: false,
      ok: false,
    };
  }

  @ApiOperation({
    summary: "Verify that a hash has been notarized",
    description:
      "It will check the timestamp api to see if the document hash has been notarized",
  })
  @Post("verify")
  @UseFilters(new HttpUnauthorizedExceptionFilter())
  @UseFilters(new HttpForbiddenExceptionFilter())
  @UseFilters(new HttpBadRequestExceptionFilter())
  @Render("index")
  async verifyHash(
    @Body(validationPipe)
    @Body()
    data: VerifyDto
  ) {
    this.logger.log("POST verify/  ");
    this.logger.debug(`data: ${JSON.stringify(data)}`);
    return this.verify(data.docHash);
  }

  @ApiOperation({
    summary: "Download a stored document",
    description: `It will get the document from storage api`,
  })
  @Post("document")
  async document(
    @Body(validationPipe) data: DocumentDto,
    @Res() res: express.Response
  ) {
    this.logger.log("POST document/  ");
    this.logger.debug(`data: ${JSON.stringify(data)}`);

    const response = await this.storageService.getFile(`0x${data.hash}`);
    if (response) {
      res.set({
        "Content-Type": response.headers["content-type"],
        "Content-Disposition": response.headers["content-disposition"],
        "Content-Length": response.headers["content-length"],
      });
      res.write(Buffer.from(response.data));
      res.end();
    } else {
      // fails silently
      res.redirect(process.env.EUF_PATH_NAME);
    }
  }

  @ApiOperation({ summary: "Upload document to notarized" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: "multipart/form-data",
    required: true,
    schema: {
      type: "object",
      properties: {
        sampleFile: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @Post("fileupload")
  @Render("index")
  @UseFilters(new HttpUnauthorizedExceptionFilter())
  @UseFilters(new HttpForbiddenExceptionFilter())
  @UseFilters(new HttpBadRequestExceptionFilter())
  @UseInterceptors(
    FileInterceptor("sampleFile", { limits: { fileSize: 6000000 } })
  )
  async doDocUpload(@UploadedFile() file, @Body() body) {
    if (body == null || body.jwt == null || body.did == null) {
      return {
        error: true,
        notAuthenticated: true,
        ...this.renderOpt,
      };
    }

    if (!file || file.buffer.length === 0) {
      return {
        message: `bad file`,
        ok: false,
        user: body.did, // comes from legacy notarisation
        ...this.renderOpt,
      };
    }

    if (!body.title) {
      return {
        message: `Document title missing`,
        ok: false,
        user: body.did, // comes from legacy notarisation
        ...this.renderOpt,
      };
    }

    const cred: CredentialDto = { did: body.did, jwt: body.jwt };
    const payload = this.jwtService.extractPayloadFromToken(cred);

    this.logger.debug(
      `POST /fileupload jwt payload:${JSON.stringify(payload)} filename:${
        file.originalname
      }  body:${JSON.stringify(payload)}`
    );

    const docHash = utils.keccak256(file.buffer);
    this.logger.debug(`docHash: ${docHash}`);

    // Check if file already stored
    const metadata = await this.storageService.getKeyValue(docHash);
    if (metadata) {
      this.logger.debug(
        `storageService.getKeyValue: ${JSON.stringify(metadata)}`
      );
      return {
        message: "Already stored in the ledger",
        info: {
          hash: metadata.hash,
          timestamp: metadata.notarizedAt,
          ledgerHash: metadata.txHash,
          registeredBy: metadata.registeredBy,
        },
        ok: false,
        user: cred.did,
        ...this.renderOpt,
      };
    }

    // Store the file
    const storeRes = await this.storageService.storeFiles(file);
    if (!storeRes) {
      return {
        message: `Error while uploading`,
        ok: false,
        ...this.renderOpt,
      };
    }
    this.logger.debug(
      `return hash from store file: ${JSON.stringify(storeRes)} `
    );

    // ensure calculated hash and hash returned by storageAPI.storeFile are identical
    if (storeRes.hash !== docHash) {
      this.logger.error(
        `${docHash} provided hash does not match with stored hash: ${storeRes.hash}`
      );
      throw new BadRequestException("hash does not match with stored hash");
    }

    // Fill file metadata
    const meta: StorageMetadata = {
      name: file.originalname,
      hash: storeRes.hash,
      description: body.title,
      notarizedAt: new Date(),
      registeredBy: body.did,
      status: FileMetadataStatus.Pending,
    };

    // store metadata
    const storeMetaRes = await this.storageService.storeKeyValue(meta);
    if (!storeMetaRes) {
      return {
        message: `Error while storing metadata`,
        ...this.renderOpt,
      };
    }
    this.logger.debug(
      `Storing metadata: ${JSON.stringify(storeMetaRes.data)} `
    );

    // We can now ask to sign the TX to anchor the document on the ledger
    const signTxRes = await this.walletService.askForTransactionSignature(
      body.did,
      docHash,
      body.title
    );
    if (!signTxRes) {
      return {
        message: `Error while asking to sign the transaction to store hash on the ledger`,
        ...this.renderOpt,
      };
    }

    return {
      message: `file uploaded to ${storeRes.hash}`,
      hash: storeRes.hash,
      ok: true,
      user: cred.did,
      notary: true,
      ...this.renderOpt,
    };
  }

  @ApiOperation({
    summary: "Verify if a file is notarized",
    description: `It will check the timestamp api to see if the document hash has been notarized`,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: "multipart/form-data",
    required: true,
    schema: {
      type: "object",
      properties: {
        my_file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @Post("verifyfile")
  @Render("index")
  @UseFilters(new HttpUnauthorizedExceptionFilter())
  @UseFilters(new HttpForbiddenExceptionFilter())
  @UseFilters(new HttpBadRequestExceptionFilter())
  @UseInterceptors(
    FileInterceptor("sampleFile", { limits: { fileSize: 6000000 } })
  )
  async doVerifyFile(@UploadedFile() file, @Body() body) {
    if (!file || file.buffer.length === 0) {
      return {
        message: `bad file`,
        ok: false,
        user: body.did, // comes from legacy notarisation
        ...this.renderOpt,
      };
    }

    this.logger.debug(`POST /verifyfile filename:${file.originalname}`);

    const docHash = utils.keccak256(file.buffer);
    this.logger.debug(`docHash: ${docHash}`);

    // Check if file already notarized
    return this.verify(docHash);
  }

  private async receive(did: string, hash: string, ledgerHash: string) {
    if (!did || !hash || !ledgerHash) {
      throw new BadRequestException("Missing URL parameter");
    }

    // check hash is present in store's metadata
    const meta = await this.storageService.getKeyValue(hash);
    if (!meta) {
      throw new BadRequestException(`Metadata not found for hash ${hash}`);
    }

    // check the document has been notarized in the ledger
    const ts = await this.timestampService.getTimestamp(hash);

    if (!ts) {
      // document is not notarized yet we should display loading state and
      // try later
      return {
        waiting: true,
        signed: false,
        verified: true,
        ...this.renderOpt,
      };
    }
    if (did.toLowerCase() !== meta.registeredBy.toLowerCase()) {
      throw new BadRequestException(
        `provided owner did ${did.toLowerCase()} is different from the one stored on the ledger ${meta.registeredBy.toLowerCase()}`
      );
    }
    if (ledgerHash !== ts.txHash) {
      throw new BadRequestException(
        `provided ledger transaction hash:${ledgerHash} is different from the one registerd on the ledger ${ts.txHash}`
      );
    }
    const updatedMeta = {
      ...meta,
      txHash: ts.txHash,
      blockNumber: ts.blockNumber,
      status: FileMetadataStatus.Completed,
    };
    this.logger.debug(`Patching metadata:${JSON.stringify(updatedMeta)}`);
    // update the metadata
    const patchRes = await this.storageService.patchKeyValue(updatedMeta);
    if (patchRes) {
      return {
        waiting: false,
        signed: true,
        verified: true,
        ok: true,
        info: {
          hash: ts.hash,
          timestamp: ts.timestamp,
          ledgerHash: ts.txHash,
          registeredBy: ts.registeredBy,
        },
        ...this.renderOpt,
      };
    }
    return {
      waiting: true,
      signed: true,
      verified: true,
      ok: false,
      ...this.renderOpt,
    };
  }

  @ApiOperation({
    summary: "Update metadata if the document hash has been notarized",
    description:
      "If the hash is not yet present it will display the loading state and will callback receive-hash-done after some time (check index.hbs)",
  })
  @ApiResponse({ status: 200 })
  @Render("index")
  @Get("receive-hash")
  async receiveHash(
    @Query("did") did: string,
    @Query("hash") hash: string,
    @Query("ledgerHash") ledgerHash: string
  ) {
    return this.receive(did, hash, ledgerHash);
  }

  @ApiOperation({
    summary: "Callback for wallet when tx is signed.",
    description: "Callback for wallet when tx is signed.",
  })
  @ApiResponse({ status: 201 })
  @Render("index")
  @Post("receive-hash-done")
  async receiveDone(@Body() body: any) {
    this.logger.debug(`receive-hash-done for hash:${body.hash}`);
    return this.receive(body.did, body.hash, body.ledgerHash);
  }
}
