import React from "react";

export class OptionsBar extends React.Component{
    render(){
        return (
            <div className="options-bar">
                <button className="square" onClick={this.props.onSettingsClicked}>
                    <span className="material-symbols-outlined button">settings</span>
                </button>
            </div>
        );
    }
}