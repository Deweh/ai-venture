import React from "react";
import { TextEntry, Story, OptionsBar } from ".";

export class Content extends React.Component{
    render(){
        return (
            <div className="content-container">
                <div className="content-horizontal-flow">
                    <Story text={this.props.storyText} onChange={this.props.onStoryChange} readOnly={this.props.loading}/>
                    <OptionsBar showPopup={this.props.showPopup}/>
                </div>
                
                <TextEntry onSend={this.props.onSend} loading={this.props.loading} stoppable={true} onCancel={this.props.onCancel}/>
            </div>
        );
    }
}