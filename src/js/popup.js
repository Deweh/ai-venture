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
                    {this.props.renderChildren(this.onClosing)}
                </div>
            </div>
        );
    }
}