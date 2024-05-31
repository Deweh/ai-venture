import React from "react";
import ReactDOM from "react-dom/client"
import "../scss/app.scss";
import { PopUp, Content, Settings, AppSettings, OpenAIChatRequest, OpenAITextRequest, SettingFields, Presets } from ".";

export var SetStoryText = null;
export var GetStoryText = null;

export const CreateAPIRequest = () => {
    switch(AppSettings[SettingFields.ApiType]){
        case "openai-chat":
            return new OpenAIChatRequest();
        case "openai-text":
            return new OpenAITextRequest();
        default:
            return null;
    }
}

export class App extends React.Component{
    state = {
        storyText: "",
        popupRender: null,
        loading: false
    }

    constructor(props){
        super(props);
        let storedStory = window.localStorage.getItem("story");
        if(storedStory != null) {
            this.state.storyText = storedStory;
        }

        SetStoryText = (txt) => { this.setState({ storyText: txt }) };
        GetStoryText = () => { return this.state.storyText };
    }

    lastRequest = null
    storyBuffer = ""

    onStoryChange = (e) => {
        this.setState({storyText: e.target.value});
    }

    onStreamUpdate = (newText, done) => {
        if(!done){
            if(newText == undefined || newText == null){
                return;
            }
            this.storyBuffer += newText;
            this.setState({ storyText: this.storyBuffer });
        } else {
            this.setState({ loading: false });
        }
    }

    onSend = (value) => {
        let req = CreateAPIRequest();
        if(req == null){
            alert("Invalid API type, please select a different API type in settings.");
            return;
        }

        this.storyBuffer = (this.state.storyText + value);
        this.setState({ storyText: this.storyBuffer, loading: true });
        req.url = AppSettings[SettingFields.ApiUrl];
        req.apiKey = AppSettings[SettingFields.ApiKey];
        req.maxTokens = AppSettings[SettingFields.MaxTokens];
        req.temperature = AppSettings[SettingFields.Temperature];
        req.top_p = AppSettings[SettingFields.TopP];
        req.top_k = AppSettings[SettingFields.TopK];
        req.frequency_penalty = AppSettings[SettingFields.FrequencyPenalty];
        req.present_penalty = AppSettings[SettingFields.PresentPenalty];
        req.repeat_penalty = AppSettings[SettingFields.RepeatPenalty];
        req.model = AppSettings[SettingFields.ApiModel];
        req.system_message = AppSettings[SettingFields.SystemPrompt];
        req.strict_compliance = AppSettings[SettingFields.ApiStrictCompliance];
        req.sys_prompt_compat = AppSettings[SettingFields.SysPromptCompat];
        req.prompt_format = AppSettings[SettingFields.PromptFormat]
        req.SendPrompt(this.storyBuffer, this.onStreamUpdate);
        this.lastRequest = req;
    }

    onCancel = () => {
        if(this.lastRequest != null && this.lastRequest.CancelRequest() == true) {
            this.setState({ loading: false });
            this.lastRequest = null;
        }
    }

    openPopup(a_render){
        this.setState({ popupRender: a_render })
    }

    closePopup = () => {
        this.setState({ popupRender: null });
    }

    showPopup = (type) => {
        let renderFunc = null;
        switch(type){
            case "settings":
                renderFunc = (onClose) => <Settings key="settings-popup" onClose={onClose}/>;
                break;
            case "presets":
                renderFunc = (onClose) => <Presets key="presets-popup" onClose={onClose}/>;
                break;
            default:
                alert("Not yet implemented.");
                break;
        }
        if(renderFunc != null){
            this.openPopup(renderFunc);
        }
    }

    renderPopupChildren = (onCloseFunc) => {
        return this.state.popupRender(onCloseFunc);
    }

    renderPopup = () => {
        if(this.state.popupRender != null) {
            return <PopUp onClose={this.closePopup} renderChildren={this.renderPopupChildren}/>;
        } else {
            return <div/>
        }
    }

    render(){
        return (
            <div>
                <Content
                    storyText={this.state.storyText}
                    showPopup={this.showPopup}
                    loading={this.state.loading}
                    onSend={this.onSend}
                    onCancel={this.onCancel}
                    onStoryChange={this.onStoryChange}
                />
                {this.renderPopup()}
            </div>
        );
    }
}

let storedSettings = window.localStorage.getItem("settings");
if(storedSettings != null){
    Object.assign(AppSettings, JSON.parse(storedSettings));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);