import { getClientInfo } from "./client-info";
import nock from "nock";

describe("getClientInfo", (): void => {
  it("should be able to make an API request and convert some numbers", (): Promise<
    void
  > => {
    /* eslint-disable @typescript-eslint/camelcase */
    const serverData: RawClientInfo = {
      client_user_agent: "abc123",
      client_ip: "1.2.3.4",
      client_asn: "10225",
      client_region: "abc123",
      client_country_code: "abc123",
      client_continent_code: "abc123",
      client_metro_code: "abc123",
      client_postal_code: "abc123",
      client_conn_speed: "abc123",
      client_gmt_offset: "abc123",
      client_latitude: "abc123",
      client_longitude: "abc123",
      resolver_ip: "abc123",
      resolver_asn: "33",
      resolver_region: "abc123",
      resolver_country_code: "abc123",
      resolver_continent_code: "abc123",
      resolver_conn_speed: "abc123",
      resolver_latitude: "abc123",
      resolver_longitude: "abc123"
    };
    /* eslint-enable @typescript-eslint/camelcase */
    nock("https://api.fastly.com")
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/client-info")
      .reply(200, serverData);

    const output = getClientInfo("https://api.fastly.com/client-info");
    return output.then(
      (result: ClientInfo): void => {
        expect(result.client_ip).toEqual("1.2.3.4");
        expect(result.client_asn).toEqual(10225);
        expect(result.resolver_asn).toEqual(33);
      }
    );
  });
});
