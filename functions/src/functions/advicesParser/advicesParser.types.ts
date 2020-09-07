export class AdviceItem {
    constructor(title: string, reply: string) {
        this.title = title;
        this.reply = reply;
    }

    title: string;
    reply: string;
}

export class Advice {
    constructor(watermark: string, advices: Array<AdviceItem>) {
        this.watermark = watermark;
        this.advices = advices;
    }

    advices: Array<AdviceItem>;
    watermark: string;
}
