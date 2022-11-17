#!/node

const expectedIndexPatterns = require('./index-patterns.json')

const kibanaHost = process.env.KIBANA_HOST ?? 'localhost:5601'

main()

async function main() {
  const existentPatterns = await getExistentIndexPattern()
  const existentPatternsTitles = new Set(existentPatterns.map(a => a.title))

  for (const expectedIndexPattern of expectedIndexPatterns) {
    console.group(expectedIndexPattern.title)
    try {
      if (existentPatternsTitles.has(expectedIndexPattern.title)) {
        console.log('skiping: it already exists')
        continue
      }

      const created = await create(expectedIndexPattern)
      existentPatterns.push(created)
    } finally {
      console.groupEnd()
    }
  }

  await setDefault(existentPatterns.find(a => a.title === '*'))

  console.log('done')
}

async function getExistentIndexPattern() {
  const res = await fetch(`http://${kibanaHost}/api/saved_objects/_find?type=index-pattern`)
  if (!res.ok) throw new Error('It was not possible to get index-patterns list')

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

  if (!res.ok) throw new Error(`It was not possible to create ${index_pattern.title}: ${await res.text()}`)

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

  if (!resDefault.ok) throw new Error(`It was not possible to define ${indexPattern.title} (${indexPattern.id}) as default`)

  console.log(`${indexPattern.title} (${indexPattern.id}) set as default`)
}