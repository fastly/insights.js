/* eslint-disable @typescript-eslint/camelcase */
const configFixture: Config = {
  session:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMDBmZTliNi05MWM2LTQ0MzQtOGU3Ny0xNDYzMGUyNjNhMjYiLCJleHAiOjE1NTY3MDUxNjIsImlhdCI6MTU1NjcwNTEwM30.Pig3FCY94l2vIfBsIHAPsCzE2mgkGpXcbe0QKHPJcq4",
  hosts: {
    host: "test.fastly-insights.com",
    lookup: "eu.u.test.fastly-insights.com"
  },
  // AKA the "config" object --------------------------
  settings: {
    initial_delay: 0,
    max_tasks: 20,
    report_errors: false,
    sample_rate: 0.4,
    token: "d00fe9b6-91c6-4434-8e77-14630e263a26"
  },
  server: {
    datacenter: "LCY"
  },
  tasks: [
    {
      name: "MAD",
      id: "77d7es76-77ae-477a-7a33-7a7f7c162004",
      req_header: "",
      resource: "https://mad-v4.pops.test.fastly-insights.com/o.svg",
      resp_header: "",
      type: "pop",
      weight: 3.23
    },
    {
      name: "LCY",
      id: "88271afb-88ae-4888-abca-8817aba9182a",
      req_header: "",
      resource: "https://lcy-v4.pops.test.fastly-insights.com/o.svg",
      resp_header: "",
      type: "pop",
      weight: 1.01
    },
    {
      name: "rtt",
      id: "8a8100bc-9217-48a7-918f-81673da8a99f",
      req_header: "",
      resource: "https://www.fastly-insights.com/rtt.json",
      resp_header: "",
      type: "fetch",
      weight: 1
    }
  ]
};
/* eslint-enable @typescript-eslint/camelcase */

export default configFixture;
