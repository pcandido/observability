const grafanaUser = process.env.GRAFANA_USER ?? 'admin'
const grafanaPass = process.env.GRAFANA_PASS ?? 'admin'
const grafanaHost = process.env.GRAFANA_HOST ?? 'localhost:3000'

async function request(urlPath, method, options) {

  const auth = options?.token ? `Bearer ${options.token}` : `Basic ${btoa(`${grafanaUser}:${grafanaPass}`)}`


  const res = await fetch(`http://${grafanaHost}/api/${urlPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: JSON.stringify(options?.body)
  })

  if (!res.ok) throw new Error(`It was not possible request to grafana (${urlPath}): ${await res.text()}`)

  return await res.json()
}

module.exports = request