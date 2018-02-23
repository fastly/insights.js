# Insights.js [![Travis Build Status][travis-img]][travis]
Real user monitoring 

[travis]: https://travis-ci.com/fastly/insights.js
[travis-img]: https://travis-ci.com/fastly/insights.js.svg?token=i6WATLrpQktJR1HWpL2Y&branch=master

## Quick links
- [FAQ](#faq)
- [Installation](#installation)
- [Running](#running)

## Installation

### Requirements
- Node.js >= 6 (```brew install node```)
- Yarn (```brew install yarn```)

### Install
```sh
git clone git@github.com:fastly/insights.js.git
cd insights.js
yarn
yarn run build
```

## Running
Most actions you'd like to perform whilst developing insights.js are defined as NPM scripts tasks and can be invoked using `yarn run {task}`.

A list of all commands and their description can be found below.


Name                   | Description
-----------------------|-----------------------------
clean | Cleans the working directory of all compiled artefacts from the `dist` directory
build-development | Compiles the application for development
build-production | Compiles the application for production environments
build | Verifies and compiles the source
format | Automatically formats the source files using prettier
lint | Lints the source files for style errors using ESLint
verify | Runs the format and lint
unit-test | Runs the unit test suite
test | Runs verify and unit-test


## FAQ

### What is it?
Fastly Insights is an optional service deployed by some Fastly customers for network and performance monitoring and research purposes. It does not collect any personal data. We are only interested in your network, to make the internet work better.

We collect information about HTTP and HTTPS network transactions, including: network routing, performance timing, and equipment characteristics. Measurements are recorded to analyze the performance of the Fastly network and overall state of the internet. 

Insights.js is served via Fastly’s CDN. All collected data is sent back to the Fastly Insights service and log streamed using Fastly’s [log streaming](https://docs.fastly.com/guides/streaming-logs/) to a Fastly managed data warehouse for subsequent analysis. 

### How does it work?
The library is deployed to websites via a JavaScript `<script>` tag, such as: 

```html
<script defer src="https://www.fastly-insights.com/insights.js?k=1111-2222-3333"></script>  
```

In the above tag, `k` is an API token that identifies the host website to Fastly. The script contains code to load and execute a minimal task runner application. All tasks are run as low-priority requests and are designed not to interfere with the user's current page navigation or alter the host page’s [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) in any way, to prevent it from accessing first-party data on the page or affecting page load performance. 

Each task fetches one or more objects from the network and gathers timing information associated with the request (using the [ResourceTiming API](https://w3c.github.io/resource-timing/)) and any other browser information required by the task. See [below](#what-type-of-information-does-fastly-insights-collect) for the full list of task types.

The results of each task are normalized (such as IP anonymization, see [full list of task types](#what-type-of-information-does-fastly-insights-collect) for further information regarding normalization) and the data is then beaconed back to the Fastly Insights service via a POST request to fastly-insights.com/beacon.

The service then adds additional data available from Fastly’s [standard logging variables](https://docs.fastly.com/guides/streaming-logs/useful-variables-to-log) related to the network request and logs all final data to a Fastly managed data warehouse.

### Request flow
![Request flow](https://github.com/fastly/insights.js/blob/master/doc/request-flow.png)

1. Page load.
1. Fetches configuration from Fastly Insights service.
1. Tasks are executed (see also: [full list of task types](#what-type-of-information-does-fastly-insights-collect) and data collected):
    1. Network requests made to test objects.
    1. Task information recorded on the client.
1. Task information is beaconed back to the Fastly Insights service.
1. Additional information is recorded at the Fastly Insights service before ingestion.
1. Information collected in step 3 and 5 is logged to a Fastly managed data warehouse for post-processing.

### What type of information does Fastly Insights collect?
The following table lists each of the possible tasks Fastly Insights may run on a host web page: 

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Client data*</th>
            <th>Request metadata*</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>POP</td>
            <td>Intended to measure the latency and topology of client connections to Fastly’s point of presence (POP) data centers.</td>
            <td>
                <ul>
                    <li><a href="https://w3c.github.io/resource-timing/#performanceresourcetiming">network timing</a></li>
                    <li>network characteristics</li>
                    <li>browser type (<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent">User-Agent header</a> value is automatically normalized to browser vendor and version)</li>
                    <li>DNS recursive resolver</li>
                    <li>operating system</li>
                <ul>
            </td>
            <td>
                <ul>
                    <li>anonymized Internet Protocol (IP) addresses (client IP addresses are automatically truncated to a /28 network prefix for IPv4 and /58 for IPv6 addresses)</li>
                    <li>country or city-level geographic location</li>
                    <li>date/time stamps</li>
                    <li>network characteristics unique to the client connection</li>
                    <li>browser capabilities: TLS protocol and cipher suites</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

**_*Note:_**
_**Client data** is collected on the client within a browser and **Request metadata** is collected on the Fastly Insights service._

### What does Fastly use Fastly Insights information for?
Fastly uses the data collected to identify trends and performance heuristics for clients interacting with Fastly and its services. Fastly's use, and potential disclosure, of the data includes:

- Monitoring Fastly’s network and performance
- Improving the accuracy of DNS query answers
- Improving Fastly's capacity and network planning
- A/B testing and comparison of the performance of new technologies to improve Fastly services
- Research initiatives to inform technology decisions
- Research initiatives to inform case studies
- Research initiatives for academic purposes and to feed back to the wider community
- Responding to performance and other related inquiries from Fastly’s customers

### Privacy concerns
As described above in this FAQ, the information collected is statistical data and does not include personally identifiable data. Client IP addresses are truncated, and user-agent strings normalized before ingestion. See the [full list of task types](#what-type-of-information-does-fastly-insights-collect) for a list of data collected.

Fastly Insights does not read or write any data to persistent storage in the browser, which includes cookies. Fastly Insights does not interact with cookies. We do not store any information across browsing sessions.

We may retain the raw information collected from individual Fastly Insights sessions for up to one year. We may retain aggregate information indefinitely.

### Fastly’s commitment to transparency
Any changes to this FAQ document and the data we collect over time will be logged in our [change log](https://github.com/fastly/insights.js/blob/master/CHANGELOG.md).

## License
[MIT](https://github.com/fastly/insights.js/blob/master/LICENSE)
