import React from "react";

export class SettingFields {
    static ApiType = "api-type"
    static ApiUrl = "api-url"
    static ApiKey = "api-key"
    static ApiModel = "api-model"
    static RepeatPenalty = "repeat-penalty"
    static SystemPrompt = "system-prompt"
    static PromptFormat = "prompt-format"
    static MaxTokens = "max-tokens"
    static Temperature = "temperature"
    static TopP = "top_p"
    static ApiStrictCompliance = "api-strict-compliance"
}

export var AppSettings = {
    "api-type": "openai",
    "api-url": "http://127.0.0.1:8080/",
    "api-key": "-",
    "system-prompt": "You are a helpful assistant.",
    "prompt-format": "{system}\nUSER: {input}\nASSISTANT: ",
    "max-tokens": 250,
    "temperature": 0.7,
    "top_p": 0.95,
    "api-model": "",
    "repeat-penalty": 1.0,
    "api-strict-compliance": false
};

class APIOptions extends React.Component{
    render() {
        return(
            <div className="flex-vertical" style={{"gap": "1vh"}}>
                <div className="flex-horizontal">
                    <span className="center">API Type:</span>
                    <select defaultValue={this.props.settingsCopy[SettingFields.ApiType]} onChange={(e) => this.props.onValueChange(SettingFields.ApiType, e)}>
                        <option value="openai">OpenAI Compatible</option>
                    </select>
                </div>
                <div className="flex-horizontal">
                    <span className="center">API URL:</span>
                    <input type="text" className="flex-fill" defaultValue={this.props.settingsCopy[SettingFields.ApiUrl]} onChange={(e) => this.props.onValueChange(SettingFields.ApiUrl, e)}></input>
                </div>
                <div className="flex-horizontal">
                    <span className="center">API Key:</span>
                    <input type="text" className="flex-fill" defaultValue={this.props.settingsCopy[SettingFields.ApiKey]} onChange={(e) => this.props.onValueChange(SettingFields.ApiKey, e)}></input>
                </div>
                <div className="flex-horizontal">
                    <span className="center">Model:</span>
                    <input type="text" className="flex-fill" defaultValue={this.props.settingsCopy[SettingFields.ApiModel]} onChange={(e) => this.props.onValueChange(SettingFields.ApiModel, e)}></input>
                </div>
                <div className="flex-horizontal">
                    <span className="center">Strict Compliance:</span>
                    <input type="checkbox" defaultChecked={this.props.settingsCopy[SettingFields.ApiStrictCompliance]} onChange={(e) => this.props.onValueChange(SettingFields.ApiStrictCompliance, e, true)}></input>
                </div>
            </div>
        );
    }
}

class PromptOptions extends React.Component{
    render() {
        return(
            <div className="flex-vertical" style={{"gap": "1vh"}}>
                <span style={{"margin-right": "1vh"}}>System Prompt:</span>
                <div className="flex-horizontal">
                    <textarea className="flex-fill rv" defaultValue={this.props.settingsCopy[SettingFields.SystemPrompt]} onChange={(e) => this.props.onValueChange(SettingFields.SystemPrompt, e)}/>
                </div>
                <span style={{"margin-right": "1vh"}}>Prompt Format:</span>
                <div className="flex-horizontal">
                    <textarea className="flex-fill rv" defaultValue={this.props.settingsCopy[SettingFields.PromptFormat]} onChange={(e) => this.props.onValueChange(SettingFields.PromptFormat, e)}/>
                </div>
            </div>
        );
    }
}

class AIOptions extends React.Component{
    render() {
        return(
            <div className="flex-vertical" style={{"gap": "1vh"}}>
                <div className="flex-horizontal">
                    <span className="center">Max Tokens:</span>
                    <input type="text" defaultValue={this.props.settingsCopy[SettingFields.MaxTokens]} onChange={(e) => this.props.onValueChange(SettingFields.MaxTokens, e)}/>
                </div>
                <div className="flex-horizontal">
                    <span className="center">Temperature:</span>
                    <input type="text" defaultValue={this.props.settingsCopy[SettingFields.Temperature]} onChange={(e) => this.props.onValueChange(SettingFields.Temperature, e)}/>
                </div>
                <div className="flex-horizontal">
                    <span className="center">Top-P:</span>
                    <input type="text" defaultValue={this.props.settingsCopy[SettingFields.TopP]} onChange={(e) => this.props.onValueChange(SettingFields.TopP, e)}/>
                </div>
                <div className="flex-horizontal">
                    <span className="center">Repeat Penalty:</span>
                    <input type="text" defaultValue={this.props.settingsCopy[SettingFields.RepeatPenalty]} onChange={(e) => this.props.onValueChange(SettingFields.RepeatPenalty, e)}/>
                </div>
            </div>
        );
    }
}

export class SettingsTab{
    static API = "api";
    static Prompts = "prompts";
    static AI = "ai";
}

export class Settings extends React.Component{
    settingsCopy = { ...AppSettings }

    state = {
        activeTab: SettingsTab.AI
    }

    onTabSelected = (id) => {
        this.setState({ activeTab: id });
    }

    renderTabBtn = (id, displayName) => {
        let isActive = (this.state.activeTab == id);
        return (
            <button className={isActive ? "selected" : ""} disabled={isActive} onClick={() => { this.onTabSelected(id) }}>{displayName}</button>
        );
    }

    renderActiveTab = () => {
        switch(this.state.activeTab){
            case SettingsTab.API:
                return <APIOptions onValueChange={this.onValueChange} settingsCopy={this.settingsCopy}/>;
            case SettingsTab.Prompts:
                return <PromptOptions onValueChange={this.onValueChange} settingsCopy={this.settingsCopy}/>;
            case SettingsTab.AI:
                return <AIOptions onValueChange={this.onValueChange} settingsCopy={this.settingsCopy}/>
            default:
                return <div></div>
        }
    }

    startClose = () => {
        this.setState({ closing: true });
    }

    applySettings = () => {
        AppSettings = { ...this.settingsCopy };
        window.localStorage.setItem("settings", JSON.stringify(AppSettings));
    }

    onValueChange = (id, event, isCheck = false) => {
        if(!isCheck) {
            this.settingsCopy[id] = event.target.value;
        } else {
            this.settingsCopy[id] = event.target.checked;
        }
    }

    render(){
        return (
            <div className="flex-vertical h100">
                <div className="flex-horizontal" key="window-buttons-row">
                    <div className="flex-fill"/>
                    <button className="close-btn" onClick={this.props.onClose}>
                        <span className="material-symbols-outlined button small">close</span>
                    </button>
                </div>
                
                <div className="flex-horizontal" style={{"gap": "2vh", "justifyContent": "center"}} key="tabs-row">
                    {this.renderTabBtn(SettingsTab.AI, "AI")}
                    {this.renderTabBtn(SettingsTab.Prompts, "Prompts")}
                    {this.renderTabBtn(SettingsTab.API, "API")}
                </div>

                <div className="options-container">
                    {this.renderActiveTab()}
                </div>

                <div className="flex-horizontal" style={{"gap": "1vh"}} key="finish-buttons-row">
                    <div className="flex-fill"/>
                    <button onClick={this.props.onClose}>Cancel</button>
                    <button onClick={() => { this.applySettings(); this.props.onClose(); }}>Apply & Close</button>
                </div>
            </div>
        );
    }
}