export class ApiRequestBase{
    url = "https://127.0.0.1:8080"
    apiKey = "-"
    stopTokens = []
    maxTokens = 250
    temperature = 0.7
    top_p = 0.95
    top_k = 0
    repeat_penalty = 1.0
    present_penalty = 0
    frequency_penalty = 0
    system_message = "You are a helpful assistant."
    model = ""
    strict_compliance = false;
    sys_prompt_compat = false;
    prompt_format = "{input}"

    GetModels(callback){}
    SendPrompt(input, callback){}

    CancelRequest(){
        if(this.controller != null) {
            this.controller.abort();
            this.controller = null;
            return true;
        } else {
            return false;
        }
    }

    #controller = null;

    StartStream(endpoint, headers, postBody, callback){
        this.controller = new AbortController();
        fetch(this.url + endpoint, {
            signal: this.controller.signal,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(postBody)
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Network Error');
            }

            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            readEvents();

            function readEvents() {
                reader.read().then(({value, done}) => {
                    if(done) {
                        callback(null, true);
                        return;
                    }

                    const lines = value.split('\n');
                    lines.forEach(line => {
                        if(line.trim() == '') return;
                        let splitLine = line.split(':');
                        let name = splitLine.shift();
                        let data = splitLine.join(':');

                        if(name == "data"){
                            if(data.trim() != "[DONE]") {
                                let parsed = JSON.parse(data);
                                callback(parsed, false);
                            } else {
                                callback(null, true);
                                return;
                            }
                            
                        }
                    });

                    readEvents();
                }).catch(error => {
                    callback(null, true);
                });;
            }
        })
        .catch(error => {
            console.error('SSE Error:', error);
            callback(null, true);
        });;
    }
}