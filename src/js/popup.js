import React from "react";

export class PopUp extends React.Component{
    state = {
        closing: false
    }

    onClosing = () => {
        this.setState({ closing: true });
    }

    onAnimEnd = (event) => {
        if(event.animationName == "fade-out"){
            this.props.onClose();
        }
    }

    render(){
        return (
            <div className={"onTop " + (this.state.closing ? "fade-out" : "fade-in")} onAnimationEnd={this.onAnimEnd}>
                <div className="popup-window">
                    <div className="flex-vertical h100">
                        <div className="flex-horizontal" key="window-buttons-row">
                            <div className="flex-fill"/>
                            <button className="close-btn" onClick={this.onClosing}>
                                <span className="material-symbols-outlined button small">close</span>
                            </button>
                        </div>

                        {this.props.renderChildren(this.onClosing)}
                    </div>
                </div>
            </div>
        );
    }
}