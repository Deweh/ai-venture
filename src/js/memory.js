import React from "react";
import { Tooltip } from "./tooltip";
import llamaTokenizer from "llama-tokenizer-js";
import llama3Tokenizer from "llama3-tokenizer-js";
import mistralTokenizer from "mistral-tokenizer-js";
import { AppSettings, SettingFields } from "./settings";
import { GetStoryText } from ".";

export class Memory extends React.Component{

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
        let prompt = AppSettings[SettingFields.PromptFormat];
        prompt = prompt.replace("{system}", AppSettings[SettingFields.SystemPrompt]);
        prompt = prompt.replace("{input}", "");

        let maxCount = AppSettings[SettingFields.ContextLimit];
        let storyCount = this.getTokenCount(GetStoryText());
        let promptCount = this.getTokenCount(prompt);
        let totalCount = storyCount + promptCount;

        let storyPercent = ((storyCount / maxCount) * 100);
        let promptPercent = ((promptCount / maxCount) * 100);

        return(
            <div className="options-container">
                <div className="option-field">
                    <span>Context Usage: {totalCount}/{maxCount} Tokens ({Math.round((totalCount / maxCount) * 100)}%)</span>
                    <div class="progress-bar flex-horizontal">
                        <div style={{width: promptPercent.toString() + "%", display: "inline"}}>
                            <Tooltip text={"System Prompt: " + promptCount.toString() + " Tokens (" + Math.round(promptPercent).toString() + "%)"}>
                                <div class="progress-fill yellow"></div>
                            </Tooltip>
                        </div>
                        <div style={{width: storyPercent.toString() +  "%", display: "inline"}}>
                            <Tooltip text={"Story: " + storyCount.toString() + " Tokens (" + Math.round(storyPercent).toString() + "%)"}>
                                <div class="progress-fill"></div>
                            </Tooltip>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        );
    }
}