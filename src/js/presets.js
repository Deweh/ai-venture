import React from "react"
import { Tabs, SetStoryText, GetStoryText, AppSettings, Tooltip } from "."

class PresetsTab{
    static Stories = "stories";
    static Settings = "settings";
}

class SettingPresetOptions extends React.Component{
    state = {
        presetsList: []
    }

    presetNameRef = React.createRef();

    constructor(props){
        super(props);
        let storedPresets = window.localStorage.getItem("settingPresets");
        if(storedPresets != null){
            this.state.presetsList = JSON.parse(storedPresets);
        }
    }

    saveToStorage(buf) {
        window.localStorage.setItem("settingPresets", JSON.stringify(buf));
    }

    savePreset() {
        let buffer = this.state.presetsList;
        buffer.unshift({
            time: (new Date()).toLocaleString(),
            name: this.presetNameRef.current.value.length < 1 ? "Untitled" : this.presetNameRef.current.value,
            value: { ...AppSettings }
        })
        this.saveToStorage(buffer);
        this.setState({presetsList: buffer});
        this.presetNameRef.current.value = "";
    }

    loadPreset(idx) {
        Object.assign(AppSettings, this.state.presetsList[idx].value);
        window.localStorage.setItem("settings", JSON.stringify(AppSettings));
        this.forceUpdate();
    }

    deletePreset(idx) {
        if(confirm("Are you sure you wish to delete this preset?")) {
            let buffer = this.state.presetsList;
            buffer.splice(idx, 1);
            this.saveToStorage(buffer);
            this.setState({ presetsList: buffer });
        }
    }

    render(){
        let elems = [];
        elems.push(
            <div key="main" className="option-field flex-horizontal">
                <span className="center">Save Current Settings:</span>
                <input
                    type="text"
                    className="flex-fill"
                    ref={this.presetNameRef}
                    onKeyDown={(e) => { if(e.key == "Enter") this.savePreset() }}
                    />
                <button className="square" style={{"marginRight": "1vh"}} onClick={() => this.savePreset()}>
                    <span className="material-symbols-outlined button">add_circle</span>
                </button>
            </div>
        );
        for(const i in this.state.presetsList){
            const s = this.state.presetsList[i];
            let isLoaded = (Object.keys(AppSettings).length >= Object.keys(s.value).length &&
                            Object.keys(s.value).every(key => AppSettings[key] === s.value[key]));
            elems.push(
                <div key={i} className="option-field flex-horizontal" style={{"marginTop": "1vh", "gap": "0.1vh"}}>
                    <span className="center">{s.time}</span>
                    <span className="center flex-fill">{s.name}</span>
                    <button className="square" style={{"marginRight": "1vh"}} onClick={() => this.deletePreset(i)}>
                        <span className="material-symbols-outlined button">delete</span>
                    </button>
                    <button className="square" style={{"marginRight": "1vh"}} disabled={isLoaded} onClick={() => this.loadPreset(i)}>
                        <span className="material-symbols-outlined button">{isLoaded ? "check" : "download"}</span>
                    </button>
                </div>
            );
        }
        return elems;
    }
}

class StoriesOptions extends React.Component{
    state = {
        storiesList: []
    }

    storyNameRef = React.createRef();

    constructor(props){
        super(props);
        let storedStories = window.localStorage.getItem("storedStories");
        if(storedStories != null){
            this.state.storiesList = JSON.parse(storedStories);
        }
    }

    saveToStorage(buf) {
        window.localStorage.setItem("storedStories", JSON.stringify(buf));
    }

    saveStory() {
        let buffer = this.state.storiesList;
        buffer.unshift({
            time: (new Date()).toLocaleString(),
            name: this.storyNameRef.current.value.length < 1 ? "Untitled" : this.storyNameRef.current.value,
            value: GetStoryText()
        });
        this.saveToStorage(buffer);
        this.setState({ storiesList: buffer });
        this.storyNameRef.current.value = "";
    }

    loadStory(idx) {
        SetStoryText(this.state.storiesList[idx].value);
    }

    deleteStory(idx) {
        if(confirm("Are you sure you wish to delete this story?")) {
            let buffer = this.state.storiesList;
            buffer.splice(idx, 1);
            this.saveToStorage(buffer);
            this.setState({ storiesList: buffer });
        }
    }

    render(){
        let elems = [];
        elems.push(
            <div key="main" className="option-field flex-horizontal">
                <span className="center">Save Current Story:</span>
                <input
                    type="text"
                    className="flex-fill"
                    ref={this.storyNameRef}
                    onKeyDown={(e) => { if(e.key == "Enter") this.saveStory() }}
                    />
                <button className="square" style={{"marginRight": "1vh"}} onClick={() => this.saveStory()}>
                    <span className="material-symbols-outlined button">add_circle</span>
                </button>
            </div>
        );
        let txt = GetStoryText();
        for(const i in this.state.storiesList){
            const s = this.state.storiesList[i];
            let isLoaded = (txt == s.value);
            elems.push(
                <div key={i} className="option-field flex-horizontal" style={{"marginTop": "1vh", "gap": "0.1vh"}}>
                    <span className="center">{s.time}</span>
                    <span className="center flex-fill">{s.name}</span>
                    <button className="square" style={{"marginRight": "1vh"}} onClick={() => this.deleteStory(i)}>
                        <span className="material-symbols-outlined button">delete</span>
                    </button>
                    <button className="square" style={{"marginRight": "1vh"}} disabled={isLoaded} onClick={() => this.loadStory(i)}>
                        <span className="material-symbols-outlined button">{isLoaded ? "check" : "import_contacts"}</span>
                    </button>
                </div>
            );
        }
        return elems;
    }
}

export class Presets extends React.Component{
    render(){
        return (
            <Tabs
                tabs={{
                    [PresetsTab.Stories]: {
                        displayName: "Stories",
                        render: () => <StoriesOptions/>
                    },
                    [PresetsTab.Settings]: {
                        displayName: "Settings",
                        render: () => <SettingPresetOptions/>
                    }
                }}
                
                initialTab={PresetsTab.Stories}/>
        );
    }
}