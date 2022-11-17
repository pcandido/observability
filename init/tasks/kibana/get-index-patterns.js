#!/node

const fs = require('fs/promises')
const path = require('path')

const kibanaHost = process.env.KIBANA_HOST ?? 'localhost:5601'

main()

async function main() {
  const indexPatternIds = await getIndexPatternIds()
  const indexPatterns = await Promise.all(indexPatternIds.map(getIndexPattern))
  await saveIndexPatterns(indexPatterns)

  console.log('done')
}

async function getIndexPatternIds() {
  const res = await fetch(`http://${kibanaHost}/api/saved_objects/_find?type=index-pattern`)
  if (!res.ok) throw new Error(`It was not possible to get index-patterns list: ${await res.text()}`)

  const resJson = await res.json()
  return resJson.saved_objects.map(a => a.id)
}

async function getIndexPattern(id) {
  const res = await fetch(`http://${kibanaHost}/api/index_patterns/index_pattern/${id}`)
  if (!res.ok) throw new Error(`It was not possible to get index-pattern ${id}: ${await res.text()}`)

  const body = await res.json()
  const indexPattern = body.index_pattern

  delete indexPattern.id
  delete indexPattern.version

  return indexPattern
}

async function saveIndexPatterns(indexPatterns) {
  const filePath = path.join(__dirname, 'index-patterns.json')
  const fileBody = JSON.stringify(indexPatterns, null, 4)
  await fs.writeFile(filePath, fileBody)
}
