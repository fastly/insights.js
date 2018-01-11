function generateHosts(host) {
  const domainRegex = /^(?:[\w\d]*\.)?([^:\/\n\s]+)$/;

  host = host || "www.fastly-insights.com";
  const isProd = /www/.test(host);
  const domain = host.match(domainRegex)[1];
  const stageDomain = isProd ? domain : host;

  return {
    host,
    lookup: `u.${stageDomain}`,
    pop: `pops.${stageDomain}`
  };
}

export default generateHosts;
