addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const init = {headers: {"Access-Control-Allow-Headers":"*","Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "*",},}
    const myBlob = await request.blob()
    var code=new Date().getTime()
    if (request.headers.get('referencia')) {referencia=request.headers.get('referencia');}
    var conteudo={};
    var hash="";
    conteudo.id=code;
    if (myBlob.size) {
        const response = await fetch('https://api.imgur.com/3/upload', {method: "post",headers: {Authorization: "Client-ID 1fe6222965ec744"},body: myBlob})
        const results = await gatherResponse(response)
        if (!results.data.id) {return new Response("API não retornou uma imagem", init)}
        if (results.data.mp4) {conteudo.tipo="video"} else {conteudo.tipo="imagem"}
        conteudo.link=results.data.id
        hash=results.data.deletehash
    } else {
        if (!request.headers.get('mensagem') || !request.headers.get('referencia')) {
            return new Response("Precisa de uma imagem ou mensagem", init)
        }
    }
    if (request.headers.get('mensagem')) {
        msg=decodeURIComponent(request.headers.get('mensagem'))
        conteudo.mensagem=msg.slice(0,600).replaceAll('<', "&lt;").replaceAll('>', "&gt;").replace(/\*\*(.*?)\*\*/g,"<span class=spoiler>$1</span>").replace(/\&gt;(.*?)\./g,"<span style=color:green>&gt;$1</span>").replace(/\&lt;(.*?)\./g,"<span style=color:red>&lt;$1</span>");
    }
    var topicos_temp = await topicos.get("topicos")
    if (topicos_temp === null) {
        topicos1 = {};
    } else {
        topicos1 = JSON.parse(topicos_temp);
    }
    
    if (topicos1[referencia]) {
        topicos1[referencia].mensagens.push(conteudo)
        topicos1[referencia].atualizado=new Date().getTime()
        topicos1[referencia].hashes.push(hash)
    } else {
        topicos1[code]={};
        topicos1[code].expira=parseInt(new Date().getTime() / 1000)+3600
        topicos1[code].atualizado=new Date().getTime()
        conteudo.expira=topicos1[code].expira
        conteudo.atualizado=topicos1[code].atualizado
        topicos1[code].hashes=[]
        topicos1[code].mensagens=[]
        topicos1[code].mensagens.push(conteudo)
        topicos1[code].hashes.push(hash)
    }
    for (var i in topicos1) {
        if (parseInt(topicos1[i]['expira']-parseInt(new Date().getTime() / 1000)) < 1) {
            delete topicos1[i]
        }
    }
    await topicos.put("topicos", JSON.stringify(topicos1))
    return new Response("OK", init)
}

async function gatherResponse(response) {
    return await response.json()
}