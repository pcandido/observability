#!/node

const fs = require('fs/promises')
const path = require('path')

const kibanaHost = process.env.KIBANA_HOST ?? 'localhost:5601'

main()

async function main() {
  const indexPatternIds = await getIndexPatternIds()
  const indexPatterns = await Promise.all(indexPatternIds.map(getIndexPattern))

  const indexPatternDir = path.join(__dirname, '..', 'index-patterns')
  fs.mkdir(indexPatternDir, { recursive: true })

  for (const indexPattern of indexPatterns) {
    await saveIndexPattern(indexPattern, indexPatternDir)
  }

  console.log('done')
}

async function getIndexPatternIds() {
  const res = await fetch(`http://${kibanaHost}/api/saved_objects/_find?type=index-pattern`)
  if (!res.ok) throw new Error('Was not possible to get index-patterns list')

  const resJson = await res.json()
  return resJson.saved_objects.map(a => a.id)
}

async function getIndexPattern(id) {
  const res = await fetch(`http://${kibanaHost}/api/index_patterns/index_pattern/${id}`)
  if (!res.ok) throw new Error(`Was not possible to get index-pattern ${id}`)

  const body = await res.json()
  const indexPattern = body.index_pattern
  
  delete indexPattern.id
  delete indexPattern.version

  return indexPattern
}

async function saveIndexPattern(indexPattern, dir) {
  const filePath = path.join(dir, getFileName(indexPattern.title))
  const fileBody = JSON.stringify(indexPattern)
  await fs.writeFile(filePath, fileBody)
}

function getFileName(indexPatternTitle) {
  return indexPatternTitle.replace('*', 'star') + '.json'
}