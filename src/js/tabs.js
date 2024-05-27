import React from "react"

export class Tabs extends React.Component{
    state = {
        activeTab: ""
    }

    constructor(props){
        super(props);
        if("initialTab" in props){
            this.state.activeTab = props.initialTab;
        }
    }

    onTabSelected = (id) => {
        this.setState({ activeTab: id });
    }

    renderTabButtons = (id, displayName) => {
        let btns = [];
        for(const [key, value] of Object.entries(this.props.tabs)){
            let isActive = (this.state.activeTab == key);
            btns.push(
                <button key={key} className={isActive ? "selected" : ""} disabled={isActive} onClick={() => { this.onTabSelected(key) }}>{value.displayName}</button>
            );
        }
        return btns;
    }

    renderActiveTab = () => {
        if(this.state.activeTab in this.props.tabs) {
            return this.props.tabs[this.state.activeTab].render();
        } else {
            return <div></div>
        }
    }

    render(){
        return (
            <div className="flex-vertical flex-fill" style={{"overflow": "auto"}}>
                <div className="flex-horizontal" style={{"gap": "2vh", "justifyContent": "center"}} key="tabs-row">
                    {this.renderTabButtons()}
                </div>

                <div className="options-container">
                    {this.renderActiveTab()}
                </div>
            </div>
        );
    }
}