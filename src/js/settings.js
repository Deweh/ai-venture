import React from "react";
import { Tabs } from ".";

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
    static TopK = "top_k"
    static ApiStrictCompliance = "api-strict-compliance"
    static SysPromptCompat = "sys-prompt-compat"
    static PresentPenalty = "present-penalty"
    static FrequencyPenalty = "freq-penalty"
}

export var AppSettings = {
    "api-type": "openai-chat",
    "api-url": "http://127.0.0.1:8080/",
    "api-key": "-",
    "system-prompt": "You are a helpful assistant.",
    "prompt-format": "{system}\nUSER: {input}\nASSISTANT: ",
    "max-tokens": 250,
    "temperature": 0.7,
    "top_p": 0.95,
    "api-model": "",
    "repeat-penalty": 1.0,
    "api-strict-compliance": false,
    "sys-prompt-compat": false,
    "top_k": 0,
    "present-penalty": 0,
    "freq-penalty": 0
};

export const Tooltip = (props) => {
    const [active, setActive] = React.useState(false);
    const [coords, setCoords] = React.useState({ x: 0, y: 0 });
    
    const shouldUse = () => {
        return (props.text != null && props.text != undefined && props.text.length > 0);
    }

    const mouseMove = (e) => {
        setCoords({ x: e.pageX, y: e.pageY });
    }

    const mouseOut = (e) => {
        setActive(false);
    }

    const mouseOver = (e) => {
        if(shouldUse()){
            setCoords({ x: e.pageX, y: e.pageY });
            setActive(true);
        }
    }

    const renderTip = () => {
        if(shouldUse()){
            return (
                <div className="floater" style={{"transform": "translate(" + (coords.x + 10) + "px, " + (coords.y + 10) + "px)", "opacity": (active ? "100%" : "0%")}}>
                    {props.text}
                </div>
            );
        }
        return null;
    }

    return (
        <span onMouseOver={mouseOver} onMouseOut={mouseOut} onMouseMove={(active ? mouseMove : () => {})}>
            {props.children}
            {renderTip()}
        </span>
    );
}

export const SettingTextBox = (props) => {
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

export const SettingCheckBox = (props) => {
    const helpActive = () => {
        return hovered && props.helpText != null && props.helpText != undefined;
    }

    return(
        <Tooltip text={props.helpText}>
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
        </Tooltip>
    );
}

export const SettingTextArea = (props) => {
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

export const SettingSelection = (props) => {
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
                <SettingSelection data={this.props.data} displayName="API Type:" id={SettingFields.ApiType}
                    options={{
                        "openai-chat": "OpenAI Chat Completion",
                        "openai-text": "OpenAI Text Completion"
                    }}/>
                <SettingTextBox data={this.props.data} displayName="API URL:" id={SettingFields.ApiUrl}/>
                <SettingTextBox data={this.props.data} displayName="API Key:" id={SettingFields.ApiKey} secure={true}/>
                <SettingTextBox data={this.props.data} displayName="Model:" id={SettingFields.ApiModel}/>
                <SettingCheckBox data={this.props.data} displayName="Strict Compliance:" id={SettingFields.ApiStrictCompliance}
                    helpText="With this option enabled, only AI settings known to work with this API type will be sent, otherwise all AI options will be sent."/>
                <SettingCheckBox data={this.props.data} displayName="System Prompt Compatibility Mode:" id={SettingFields.SysPromptCompat}
                    helpText="When using chat completion, usually the system prompt is sent as a separate message to the API, but some APIs don't support this. With this option enabled, the system prompt will be sent in the user message instead, formatted using the configured prompt format."/>
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
                <SettingTextBox data={this.props.data} displayName="Top-K:" id={SettingFields.TopK}/>
                <SettingTextBox data={this.props.data} displayName="Repeat Penalty:" id={SettingFields.RepeatPenalty}/>
                <SettingTextBox data={this.props.data} displayName="Frequency Penalty" id={SettingFields.FrequencyPenalty}/>
                <SettingTextBox data={this.props.data} displayName="Presence Penalty:" id={SettingFields.PresentPenalty}/>
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
            <div className="flex-vertical flex-fill">
                <Tabs
                    tabs={{
                        [SettingsTab.AI]: {
                            displayName: "AI",
                            render: () => <AIOptions data={this.data}/>
                        },
                        [SettingsTab.Prompts]: {
                            displayName: "Prompts",
                            render: () => <PromptOptions data={this.data}/>
                        },
                        [SettingsTab.API]: {
                            displayName: "API",
                            render: () => <APIOptions data={this.data}/>
                        },
                    }}
                    
                    initialTab={SettingsTab.AI}/>

                <div className="flex-horizontal" style={{"gap": "1vh"}} key="finish-buttons-row">
                    <div className="flex-fill"/>
                    <button onClick={this.props.onClose}>Cancel</button>
                    <button onClick={() => { this.applySettings(); this.props.onClose(); }}>Apply & Close</button>
                </div>
            </div>
        );
    }
}