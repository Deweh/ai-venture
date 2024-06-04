import React from "react";
import { Tooltip } from "./tooltip";
import llamaTokenizer from "llama-tokenizer-js";
import llama3Tokenizer from "llama3-tokenizer-js";
import mistralTokenizer from "mistral-tokenizer-js";
import { AppSettings, SettingFields } from "./settings";
import { GetStoryText } from ".";

export class Memory extends React.Component{
    ctx = {
        maxCount: 0,
        storyCount: 0,
        promptCount: 0,
        totalCount: 0,
        storyPercent: 0,
        promptPercent: 0,
        totalPercent: 0
    }

    constructor(props){
        super(props);

        let prompt = AppSettings[SettingFields.PromptFormat];
        prompt = prompt.replace("{system}", AppSettings[SettingFields.SystemPrompt]);
        prompt = prompt.replace("{input}", "");

        this.ctx.maxCount = AppSettings[SettingFields.ContextLimit];
        this.ctx.storyCount = this.getTokenCount(GetStoryText());
        this.ctx.promptCount = this.getTokenCount(prompt);
        this.ctx.totalCount = this.ctx.storyCount + this.ctx.promptCount;

        this.ctx.storyPercent = ((this.ctx.storyCount / this.ctx.maxCount) * 100);
        this.ctx.promptPercent = ((this.ctx.promptCount / this.ctx.maxCount) * 100);
        this.ctx.totalPercent = ((this.ctx.totalCount / this.ctx.maxCount) * 100);
    }

    getTokenCount = (str) => {
        switch(AppSettings[SettingFields.Tokenizer]){
            case "llama2":
                return llamaTokenizer.encode(str).length;
            case "llama3":
                return llama3Tokenizer.encode(str).length;
            case "mistral":
                return mistralTokenizer.encode(str).length;
            default:
                return 0;
        }
    }

    render(){
        return(
            <div className="options-container">
                <div className="option-field">
                    <span>Context Usage: {this.ctx.totalCount}/{this.ctx.maxCount} Tokens ({Math.round(this.ctx.totalPercent)}%)</span>
                    <div class="progress-bar flex-horizontal">
                        <div style={{width: this.ctx.promptPercent.toString() + "%", display: "inline"}}>
                            <Tooltip text={"System Prompt: " + this.ctx.promptCount.toString() + " Tokens (" + Math.round(this.ctx.promptPercent).toString() + "%)"}>
                                <div class="progress-fill yellow first"></div>
                            </Tooltip>
                        </div>
                        <div style={{width: this.ctx.storyPercent.toString() +  "%", display: "inline"}}>
                            <Tooltip text={"Story: " + this.ctx.storyCount.toString() + " Tokens (" + Math.round(this.ctx.storyPercent).toString() + "%)"}>
                                <div class="progress-fill"></div>
                            </Tooltip>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        );
    }
}