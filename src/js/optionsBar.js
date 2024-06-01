import React from "react";
import { Tooltip } from ".";

export class OptionsBar extends React.Component{
    render(){
        return (
            <div className="options-bar">
                <div className="flex-vertical" style={{"gap": "1vh"}}>
                    <Tooltip text="Settings">
                        <button className="square" onClick={() => this.props.showPopup("settings")}>
                            <span className="material-symbols-outlined button">settings</span>
                        </button>
                    </Tooltip>
                    <Tooltip text="Presets">
                        <button className="square" onClick={() => this.props.showPopup("presets")}>
                            <span className="material-symbols-outlined button">library_books</span>
                        </button>
                    </Tooltip>
                    <Tooltip text="Memory">
                        <button className="square" onClick={() => this.props.showPopup("memory")}>
                            <span className="material-symbols-outlined button">history</span>
                        </button>
                    </Tooltip>
                </div>
            </div>
        );
    }
}