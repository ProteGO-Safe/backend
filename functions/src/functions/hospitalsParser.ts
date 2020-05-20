import axios from 'axios';
import moment = require("moment");
import * as express from "express";
import config from "../config";

class City {
    constructor(city: string, address: string) {
        this.city = city;
        this.address = address;
    }

    city: string;
    address: string;
}

class Voivodeship {
    constructor(name: string, items: Array<City>) {
        this.name = name;
        this.items = items;
    }

    name: string;
    items: Array<City>;
}

class Hostitals {
    constructor(watermark: string, elements: Array<Voivodeship>) {
        this.watermark = watermark;
        this.elements = elements;
    }

    elements: Array<Voivodeship>;
    watermark: string;
}

const voivodeships: Array<Voivodeship> = [];

export const hospitalsParser = async (req: Request, res: express.Response) => {

    console.log("staring hospitalsParser")

    const source = 'https://www.gov.pl/web/koronawirus/lista-szpitali';
    const { JSDOM } = require('jsdom');

    try {
        const response = await axios.get(source);

        const { data, status } = response;

        if (status !== 200) {
            throw new Error('Can not fetch html');
        }

        const dom = new JSDOM(data);

        dom.window.document
            .querySelector('.law-court__list > ul')
            .querySelectorAll(':scope > li')
            .forEach((liElement: Element) => {
                const voivodeshipName = liElement.querySelector('h3')!.textContent!.replace('Województwo ', '');
                const cities: Array<City> = [];
                liElement
                    .querySelector('ol')!
                    .querySelectorAll(':scope > li')
                    .forEach(value => {
                        let address = value.textContent;
                        const city = value.textContent!.split(', ')[0];
                        address = address!.replace(`${city}, `, '');
                        cities.push(new City(city, address))
                    });

                const voivodeship = new Voivodeship(voivodeshipName, cities)
                voivodeships.push(voivodeship);
            });

        const watermark = `${moment().format('YYYY-MM-D')} - ${source}`;
        const hostitals = new Hostitals(watermark, voivodeships);

        res.set('Cache-Control', `public, max-age=${config.cache.maxAge}, s-maxage=${config.cache.sMaxAge}`);
        res.status(200)
            .send(JSON.stringify(hostitals));

        console.log("finished hospitalsParser")

    } catch (exception) {
        throw new Error(exception);
    }
};

export default hospitalsParser;
