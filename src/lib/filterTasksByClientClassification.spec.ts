import filterClassifiedTasks from "./filterTasksByClientClassification";

/* eslint-disable @typescript-eslint/camelcase */
const clientFixture = {
  country_code: "GB",
  asn: 5089,
  connection_type: "broadband",
  device_type: "unknown"
};

const tasksFixture = [
  {
    id: "test1",
    type: "fetch",
    resource: "https://test.fastly-insights.com/1.svg",
    weight: 1,
    req_header: "",
    resp_header: "",
    classification: {
      asn: undefined
    }
  },
  {
    id: "test2",
    type: "fetch",
    resource: "https://test.fastly-insights.com/2.svg",
    weight: 1,
    req_header: "",
    resp_header: "",
    classification: {
      country_code: ["DE"]
    }
  },
  {
    id: "test3",
    type: "fetch",
    resource: "https://test.fastly-insights.com/3.svg",
    weight: 1,
    req_header: "",
    resp_header: "",
    classification: {
      country_code: ["GB", "US", "DE"],
      asn: [5089]
    }
  }
];
/* eslint-enable @typescript-eslint/camelcase */

describe("filterTasksByClientClassification", (): void => {
  it("should filter tasks by their client classification", (): void => {
    const result = filterClassifiedTasks(tasksFixture, clientFixture);

    // Should filter test2 out of fixture as country_code doesn't match
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "classification": Object {
            "asn": undefined,
          },
          "id": "test1",
          "req_header": "",
          "resource": "https://test.fastly-insights.com/1.svg",
          "resp_header": "",
          "type": "fetch",
          "weight": 1,
        },
        Object {
          "classification": Object {
            "asn": Array [
              5089,
            ],
            "country_code": Array [
              "GB",
              "US",
              "DE",
            ],
          },
          "id": "test3",
          "req_header": "",
          "resource": "https://test.fastly-insights.com/3.svg",
          "resp_header": "",
          "type": "fetch",
          "weight": 1,
        },
      ]
    `);
  });
});
