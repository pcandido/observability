const request = require('./grafana-request')
const expectedDataSources = require('./datasources.json')

main()

async function main() {
  await createDataSources()
}

async function createDataSources() {
  console.group('creating datasources')
  const existents = new Set((await request('datasources', 'GET')).map(a => a.name))

  for (const datasource of expectedDataSources) {
    if (existents.has(datasource.name)) {
      console.log(`${datasource.name} already exists`)
      continue
    }

    await request('datasources', 'POST', { body: datasource })
    console.log(`${datasource.name} created!`)
  }
  console.groupEnd()
}
