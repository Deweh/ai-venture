import React from "react";

export class OptionsBar extends React.Component{
    render(){
        return (
            <div className="options-bar">
                <div className="flex-vertical" style={{"gap": "1vh"}}>
                    <button className="square" onClick={() => this.props.showPopup("settings")}>
                        <span className="material-symbols-outlined button">settings</span>
                    </button>
                    <button className="square" onClick={() => this.props.showPopup("presets")}>
                        <span className="material-symbols-outlined button">library_books</span>
                    </button>
                    <button className="square" onClick={() => this.props.showPopup("memory")}>
                        <span className="material-symbols-outlined button">history</span>
                    </button>
                </div>
            </div>
        );
    }
}