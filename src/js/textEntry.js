import React from "react";

export class TextEntry extends React.Component{
    state = {
        value: ""
    }

    onTextKey = (event) => {
        if(event.key == "Enter" && event.shiftKey == false){
            event.preventDefault();
            this.processSend();
        }
    }

    onTextChange = (event) => {
        this.setState({ value: event.target.value });
    }

    processSend = () => {
        if(this.props.onSend(this.state.value) !== false) {
            this.setState({ value: "" });
        }
    }

    shouldRenderStopButton = () => {
        return this.props.stoppable && this.props.loading;
    }

    renderStopButton = () => {
        if(this.shouldRenderStopButton()){
            return(
                <button className="connect-up" onClick={this.props.onCancel}>
                    <span className="material-symbols-outlined button">cancel</span>
                </button>
            );
        } else {
            return <div/>;
        }
    }

    render(){
        return (
            <div className="text-entry">
                <textarea value={this.state.value} onChange={this.onTextChange} onKeyDown={this.onTextKey} disabled={this.props.loading}/>
                <div className="flex-vertical">
                    <button className={"send-btn " + (this.shouldRenderStopButton() ? "connect-down " : " ")} onClick={this.processSend} disabled={this.props.loading}>
                        <span className={"material-symbols-outlined button " + (this.props.loading ? "spin" : "")}>{this.props.loading ? "sync" : "send"}</span>
                    </button>
                    {this.renderStopButton()}
                </div>
            </div>
        );
    }
}