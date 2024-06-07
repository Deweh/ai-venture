
import { ApiRequestBase } from "./request-base";

class OpenAIRequestBase extends ApiRequestBase{
    GetBasePostData(){
        let result = {
            "model": this.model,
            "stream": true,
            "temperature": Number.parseFloat(this.temperature),
            "top_p": Number.parseFloat(this.top_p),
            "max_tokens": Number.parseInt(this.maxTokens),
            "presence_penalty": Number.parseFloat(this.present_penalty),
            "frequency_penalty": Number.parseFloat(this.frequency_penalty),
            "repetition_penalty": Number.parseFloat(this.repeat_penalty)
        };

        if(!this.strict_compliance){
            result["top_k"] = Number.parseFloat(this.top_k);
            result["min_p"] = Number.parseFloat(this.min_p);
        }
        return result;
    }

    GetModels(callback){
        this.controller = new AbortController();
        fetch(this.url + "/models", {
            signal: this.controller.signal,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Network Error');
            }

            response.json().then((result) => {
                let arr = [];
                for(const i in result.data){
                    arr.push(result.data[i].id);
                }
                callback(arr);
            })
            .catch(error => {
                callback([]);
            });
        })
        .catch(error => {
            console.error('SSE Error:', error);
            callback([]);
        });
    }
}

export class OpenAITextRequest extends OpenAIRequestBase{
    BuildPostData(input) {
        let prompt = this.prompt_format;
        prompt = prompt.replace("{system}", this.system_message);
        prompt = prompt.replace("{input}", input);

        let result = this.GetBasePostData();
        result["prompt"] = prompt;
        return result;
    }

    SendPrompt(input, callback) {
        this.StartStream(
            "/completions",
            {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            this.BuildPostData(input),
            (data, done) => {
                if(!done) {
                    callback(data["choices"][0]["text"], false);
                } else {
                    callback("", true);
                }
            }
        );
    }
}

export class OpenAIChatRequest extends OpenAIRequestBase{
    BuildPostData(input) {
        let result = this.GetBasePostData();
        let messages = [];
        if(!this.sys_prompt_compat) {
            messages.push({
                "role": "system",
                "content": this.system_message
            });
        } else {
            let prompt = this.prompt_format;
            prompt = prompt.replace("{system}", this.system_message);
            prompt = prompt.replace("{input}", input);
            input = prompt;
        }

        messages.push({
            "role": "user",
            "content": input
        });
        result["messages"] = messages;
        return result;
    }

    SendPrompt(input, callback) {
        this.StartStream(
            "/chat/completions",
            {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            this.BuildPostData(input),
            (data, done) => {
                if(!done) {
                    callback(data["choices"][0]["delta"]["content"], false);
                } else {
                    callback("", true);
                }
            }
        );
    }
}