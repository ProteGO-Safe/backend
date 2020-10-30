import {Advice} from "./advicesParser.types";

export const verifyContent = (advice: Advice) => {
    const { advices } = advice;
    if (advices.length === 0) {
        throw new Error("elements size can not be 0");
    }

    advices.forEach(value => {
        const title = value.title;
        const reply = value.reply;
        if (title === '') {
            throw new Error("title can not be empty");
        }
        if (reply === '') {
            throw new Error("reply can not be empty");
        }
    })
};
