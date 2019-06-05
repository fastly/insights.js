import { getClientInfo } from "./client-info";
import clientInfoFixture from "../fixtures/clientInfo";
import nock from "nock";

describe("getClientInfo", (): void => {
  it("should be able to make an API request and convert some numbers", (): Promise<
    void
  > => {
    nock("https://api.fastly.com")
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/client-info")
      .reply(200, clientInfoFixture);

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
