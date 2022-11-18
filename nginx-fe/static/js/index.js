const valueInput = document.querySelector('#value')
const button = document.querySelector('#calculate')
const result = document.querySelector('#result')

button.onclick = async () => {
  const value = valueInput.value
  const res = await fetch(`http://localhost:8880/fibonacci/${value}`)
  if(!res.ok) {
    alert('It was not possible to calculate this fibonacci sequence.\nCheck the log for more info.')
    console.error(await res.text())
    return
  }

  const sequence = await res.json()

  result.textContent = sequence.join(', ')
}