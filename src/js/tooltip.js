import React from "react"

export const Tooltip = (props) => {
    const [active, setActive] = React.useState(false);
    const [coords, setCoords] = React.useState({ x: 0, y: 0 });
    
    const shouldUse = () => {
        return (props.text != null && props.text != undefined && props.text.length > 0);
    }

    const mouseMove = (e) => {
        setCoords({ x: e.pageX, y: e.pageY });
    }

    const mouseOut = (e) => {
        setActive(false);
    }

    const mouseOver = (e) => {
        if(shouldUse()){
            setCoords({ x: e.pageX, y: e.pageY });
            setActive(true);
        }
    }

    const renderTip = () => {
        if(shouldUse()){
            return (
                <div className="floater" style={{"transform": "translate(" + (coords.x + 10) + "px, " + (coords.y + 10) + "px)", "opacity": (active ? "100%" : "0%")}}>
                    {props.text}
                </div>
            );
        }
        return null;
    }

    return (
        <span onMouseOver={mouseOver} onMouseOut={mouseOut} onMouseMove={(active ? mouseMove : () => {})}>
            {props.children}
            {renderTip()}
        </span>
    );
}
