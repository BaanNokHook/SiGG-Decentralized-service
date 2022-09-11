import { Injectable, HttpService, Logger } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { TimestampResponse } from "../types/timestamp.response";

@Injectable()
export default class TimestampService {
  constructor(private readonly http: HttpService) {}

  private readonly logger = new Logger(TimestampService.name);

  private readonly baseTimestampURL = `${process.env.API}timestamp/v1/hashes/`;

  /**
   * get timestamp API data for a document hash
   * @param hash document hash
   */
  async getTimestamp(hash: string): Promise<TimestampResponse> {
    this.logger.debug(`----- getTimestamp ---${hash}---- -`);
    const timestampAPIUrl = `${this.baseTimestampURL}${hash}`;
    return this.http
      .get<TimestampResponse>(timestampAPIUrl)
      .pipe(
        map((res: AxiosResponse<TimestampResponse>) => res.data),
        catchError((error) => {
          const res = error && error.response && error.response.data;
          this.logger.log(
            `Error : ${JSON.stringify(res)} calling: ${timestampAPIUrl} `
          );
          return of(null);
        })
      )
      .toPromise();
  }
}
