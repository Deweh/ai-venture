import React from "react";

export class Story extends React.Component{
    storyText = React.createRef();

    componentDidMount() {
        this.storyText.current.scrollTo({top: this.storyText.current.scrollHeight, behavior: "smooth"});
    }

    componentDidUpdate() {
        if(this.props.readOnly){
            this.storyText.current.scrollTo({top: this.storyText.current.scrollHeight, behavior: "smooth"});
        }
        window.localStorage.setItem("story", this.props.text);
    }

    render(){
        return (
            <textarea ref={this.storyText} className="story" value={this.props.text} onChange={this.props.onChange} readOnly={this.props.readOnly}/>
        );
    }
}