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

    SendPrompt(input, callback){}
    CancelRequest(){}
}