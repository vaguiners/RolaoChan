async function gatherResponse(response) {
    return JSON.stringify(await response.json())
}

async function handleRequest() {
  results = await topicos.get("topicos")
  const init = {
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  }
  return new Response(results, init)
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest())
})