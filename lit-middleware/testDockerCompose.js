const DockerCompose = require('docker-compose');
// const compose = new DockerCompose();
DockerCompose.upAll({ cwd: '.', log: true })
  .then(
    () => { console.log('done')},
    err => { console.log('something went wrong:', err.message)}
  );