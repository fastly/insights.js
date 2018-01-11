// Converts the config pop data to POP task models

function popToTask(host) {
  return pop => {
    return {
      id: pop,
      type: "pop",
      host: `${pop}-v4.${host}`
    };
  };
}

function getRandom(data) {
  return data[Math.floor(Math.random() * data.length)];
}

function transform(config, requiredCount, otherCount) {
  const REQUIRED_COUNT = requiredCount || 4;
  const OTHER_COUNT = otherCount || 0;

  const { pops: data, hosts: { pop: host } } = config;
  const toTask = popToTask(host);

  // Split the set into 2: required pops and others
  const required = data.slice(0, REQUIRED_COUNT);
  const others = data.slice(REQUIRED_COUNT);

  // Map all required POPs to task models
  const requiredTasks = required.map(toTask);

  // Select some random POPs to test from others list
  const o = [].concat(others);
  const randomTasks = [];
  const total = others.length < OTHER_COUNT ? others.length : OTHER_COUNT;

  for (let i = 0; i < total; i++) {
    const r = getRandom(o);
    o.splice(o.indexOf(r), 1);
    randomTasks.push(toTask(r));
  }

  // Return flattened array fo models
  return requiredTasks.concat(randomTasks);
}

export { popToTask, transform };
