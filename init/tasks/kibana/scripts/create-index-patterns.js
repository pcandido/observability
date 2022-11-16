#!/node

const fs = require('fs/promises')
const path = require('path')

const kibanaHost = process.env.KIBANA_HOST ?? 'localhost:5601'

main()

async function main() {
  const existentPatterns = await getExistentIndexPattern()

  const indexPatternDir = path.join(__dirname, '..', 'index-patterns')
  const indexPatterns = await getIndexPatterns(indexPatternDir)

  const newIndexPatterns = indexPatterns.filter(a => !existentPatterns.find(b => b.title === a.title))

  for (const indexPattern of newIndexPatterns) {
    console.group(`creating/updating pattern: ${indexPattern.title}`)
    const created = await create(indexPattern)
    existentPatterns.push(created)
    console.groupEnd()
  }

  await setDefault(existentPatterns.find(a => a.title === '*'))

  console.log('done')
}

async function getIndexPatterns(dir) {
  const files = await fs.readdir(dir)
  const rawData = await Promise.all(files.map(file => fs.readFile(path.join(dir, file))))
  const data = rawData.map(item => JSON.parse(item))
  return data.sort((a, b) => a.title == '*' ? -1 : b.title == '*' ? 1 : a.title - b.title)
}

async function getExistentIndexPattern() {
  const res = await fetch(`http://${kibanaHost}/api/saved_objects/_find?type=index-pattern`)
  if (!res.ok) throw new Error('Was not possible to get index-patterns list')

  const resJson = await res.json()
  return resJson.saved_objects.map(a => ({
    id: a.id,
    title: a.attributes.title
  }))
}

async function create(indexPattern) {
  const res = await fetch(`http://${kibanaHost}/api/index_patterns/index_pattern`, {
    method: 'POST',
    headers: {
      'kbn-xsrf': true,
    },
    body: JSON.stringify({
      override: true,
      refresh_fields: true,
      index_pattern: indexPattern,
    })
  })

  if (!res.ok) throw new Error(`Was not possible to create ${index_pattern.title}: ${await res.text()}`)

  const created = (await res.json()).index_pattern
  console.log(`created/updated: ${created.id}`)
  return created
}

async function setDefault(indexPattern) {
  const resDefault = await fetch(`http://${kibanaHost}/api/index_patterns/default`, {
    method: 'POST',
    headers: {
      'kbn-xsrf': true,
    },
    body: JSON.stringify({
      force: true,
      index_pattern_id: indexPattern.id,
    })
  })

  if (!resDefault.ok) throw new Error(`Was not possible to define ${indexPattern.title} (${indexPattern.id}) as default`)

  console.log(`${indexPattern.title} (${indexPattern.id}) set as default`)
}