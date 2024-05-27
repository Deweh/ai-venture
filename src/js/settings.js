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

const SettingTextBox = (props) => {
    const [focused, setFocused] = React.useState(false);

    return (
        <div className="flex-horizontal">
            <span className="center">{props.displayName}</span>
            <input
                type={(!focused && props.secure) ? "password" : "text"}
                className="flex-fill"
                defaultValue={props.data.settings[props.id]}
                onChange={(e) => props.data.onValueChange(props.id, e)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                />
        </div>
    );
}

const SettingCheckBox = (props) => {
    return(
        <div className="flex-horizontal">
            <span className="center">{props.displayName}</span>
            <div className="checkbox-container">
                <input 
                    type="checkbox"
                    defaultChecked={props.data.settings[props.id]}
                    onChange={(e) => props.data.onValueChange(props.id, e, true)}
                    />
                <span className="material-symbols-outlined check button">check</span>
            </div>
            
        </div>
    );
}

const SettingTextArea = (props) => {
    return(
        <div>
            <span>{props.displayName}</span>
            <div className="flex-horizontal">
                <textarea
                    className="flex-fill rv"
                    defaultValue={props.data.settings[props.id]}
                    onChange={(e) => props.data.onValueChange(props.id, e)}/>
            </div>
        </div>
    );
}

const SettingSelection = (props) => {
    let options = [];
    for(const [key, value] of Object.entries(props.options)){
        options.push(
            <option key={props.id + key} value={key}>{value}</option>
        );
    }

    return (
        <div className="flex-horizontal">
            <span className="center">{props.displayName}</span>
            <select defaultValue={props.data.settings[props.id]} onChange={(e) => props.data.onValueChange(props.id, e)}>
                {options}
            </select>
        </div>
    );
}

class APIOptions extends React.Component{
    render() {
        return(
            <div className="flex-vertical" style={{"gap": "1vh"}}>
                <SettingSelection data={this.props.data} displayName="API Type:" id={SettingFields.ApiType} options={{ "openai": "OpenAI Compatible" }}/>
                <SettingTextBox data={this.props.data} displayName="API URL:" id={SettingFields.ApiUrl}/>
                <SettingTextBox data={this.props.data} displayName="API Key:" id={SettingFields.ApiKey} secure={true}/>
                <SettingTextBox data={this.props.data} displayName="Model:" id={SettingFields.ApiModel}/>
                <SettingCheckBox data={this.props.data} displayName="Strict Compliance:" id={SettingFields.ApiStrictCompliance}/>
            </div>
        );
    }
}

class PromptOptions extends React.Component{
    render() {
        return(
            <div className="flex-vertical" style={{"gap": "1vh"}}>
                <SettingTextArea data={this.props.data} displayName="System Prompt:" id={SettingFields.SystemPrompt}/>
                <SettingTextArea data={this.props.data} displayName="Prompt Format:" id={SettingFields.PromptFormat}/>
            </div>
        );
    }
}

class AIOptions extends React.Component{
    render() {
        return(
            <div className="flex-vertical" style={{"gap": "1vh"}}>
                <SettingTextBox data={this.props.data} displayName="Max Tokens:" id={SettingFields.MaxTokens}/>
                <SettingTextBox data={this.props.data} displayName="Temperature:" id={SettingFields.Temperature}/>
                <SettingTextBox data={this.props.data} displayName="Top-P:" id={SettingFields.TopP}/>
                <SettingTextBox data={this.props.data} displayName="Repeat Penalty:" id={SettingFields.RepeatPenalty}/>
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
                return <APIOptions data={this.data}/>;
            case SettingsTab.Prompts:
                return <PromptOptions data={this.data}/>;
            case SettingsTab.AI:
                return <AIOptions data={this.data}/>
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

    data = {
        settings: this.settingsCopy,
        onValueChange: this.onValueChange
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