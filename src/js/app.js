import React from "react";
import ReactDOM from "react-dom/client"
import "../scss/app.scss";
import { PopUp, Content, Settings, AppSettings, OpenAIRequest, SettingFields } from ".";

export class PopupType{
    static None = null;
    static Settings = "settings";
}

export class App extends React.Component{
    state = {
        storyText: "",
        popupType: PopupType.None,
        loading: false
    }

    constructor(props){
        super(props);
        let storedStory = window.localStorage.getItem("story");
        if(storedStory != null) {
            this.state.storyText = storedStory;
        }
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
        this.storyBuffer = (this.state.storyText + value);
        this.setState({ storyText: this.storyBuffer, loading: true });
        let req = new OpenAIRequest();
        req.url = AppSettings[SettingFields.ApiUrl];
        req.apiKey = AppSettings[SettingFields.ApiKey];
        req.maxTokens = AppSettings[SettingFields.MaxTokens];
        req.temperature = AppSettings[SettingFields.Temperature];
        req.top_p = AppSettings[SettingFields.TopP];
        req.repeat_penality = AppSettings[SettingFields.RepeatPenalty];
        req.model = AppSettings[SettingFields.ApiModel];
        req.system_message = AppSettings[SettingFields.SystemPrompt];
        req.strict_compliance = AppSettings[SettingFields.ApiStrictCompliance];
        req.SendPrompt(this.storyBuffer, this.onStreamUpdate);
        this.lastRequest = req;
    }

    onCancel = () => {
        if(this.lastRequest != null && this.lastRequest.CancelRequest() == true) {
            this.setState({ loading: false });
            this.lastRequest = null;
        }
    }

    onSettingsClicked = () => {
        //alert("storyText is " + this.state.storyText);
        this.setState({ popupType: PopupType.Settings });
    }

    closePopup = () => {
        this.setState({ popupType: PopupType.None });
    }

    renderPopupChildren = (onCloseFunc) => {
        switch(this.state.popupType){
            case PopupType.Settings:
                return <Settings onClose={onCloseFunc}/>
            default:
                return <div/>
        }
    }

    renderPopup = () => {
        if(this.state.popupType != null) {
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
                    onSettingsClicked={this.onSettingsClicked}
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