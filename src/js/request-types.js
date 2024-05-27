
import { ApiRequestBase } from "./request-base";

export class OpenAIRequest extends ApiRequestBase{
    controller = null;

    BuildPostData(input) {
        let messages = [];
        if(this.strict_compliance != true) {
            messages.push({
                "role": "system",
                "content": this.system_message
            });
        } else {
            input = (this.system_message + "\n------------------------\n" + input);
        }

        messages.push({
            "role": "user",
            "content": input
        });

        return {
        "messages": messages,
        "model": this.model,
        "stream": true,
        "temperature": Number.parseFloat(this.temperature),
        "top_p": Number.parseFloat(this.top_p),
        "max_tokens": Number.parseInt(this.maxTokens),
        "presence_penalty": Number.parseFloat(this.present_penalty),
        "frequency_penalty": Number.parseFloat(this.frequency_penalty),
        "repetition_penalty": Number.parseFloat(this.repeat_penalty)
        };
    }

    SendPrompt(input, callback) {
        this.controller = new AbortController();
        fetch(this.url + "/chat/completions", {
            signal: this.controller.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(this.BuildPostData(input))
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
                        callback("", true);
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
                                callback(parsed["choices"][0]["delta"]["content"], false);
                            } else {
                                callback("", true);
                                return;
                            }
                            
                        }
                    });

                    readEvents();
                }).catch(error => {
                    callback("", true);
                });;
            }
        })
        .catch(error => {
            console.error('SSE Error:', error);
            callback("", true);
        });;
    }

    CancelRequest() {
        if(this.controller != null) {
            this.controller.abort();
            this.controller = null;
            return true;
        } else {
            return false;
        }
    }
}