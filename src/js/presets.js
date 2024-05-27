import React from "react"
import { Tabs, SetStoryText, GetStoryText } from "."

class PresetsTab{
    static Stories = "stories";
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
            <div key="main" className="flex-horizontal">
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
        for(const i in this.state.storiesList){
            const s = this.state.storiesList[i];
            elems.push(
                <div key={i} className="flex-horizontal" style={{"marginTop": "1vh", "gap": "0.1vh"}}>
                    <span className="center">{s.time}</span>
                    <span className="center flex-fill">{s.name}</span>
                    <button className="square" style={{"marginRight": "1vh"}} onClick={() => this.deleteStory(i)}>
                        <span className="material-symbols-outlined button">delete</span>
                    </button>
                    <button className="square" style={{"marginRight": "1vh"}} onClick={() => this.loadStory(i)}>
                        <span className="material-symbols-outlined button">import_contacts</span>
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
                    }
                }}
                
                initialTab={PresetsTab.Stories}/>
        );
    }
}