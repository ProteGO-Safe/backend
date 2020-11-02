import axios from 'axios';
import config from "../../config";
import moment = require("moment");

const { Storage } = require('@google-cloud/storage');

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



const verifyContent = (voivodeships: Array<Voivodeship>) => {
    if (voivodeships.length === 0) {
        throw new Error("elements size can not be 0");
    }

    voivodeships.forEach(value => {
        const items = value.items;
        const name = value.name;
        if (name === '') {
            throw new Error("name can not be empty");
        }
        if (items.length === 0) {
            throw new Error("items can not be empty");
        }
        items.forEach(value1 => {
            const address = value1.address;
            const city = value1.city;
            if (address === '') {
                throw new Error("address can not be empty");
            }
            if (city === '') {
                throw new Error("city can not be empty");
            }
        })
    })
}

export const hospitalsParser = async () => {
    const source = 'https://www.gov.pl/web/koronawirus/lista-szpitali';
    const { JSDOM } = require('jsdom');
    const voivodeships: Array<Voivodeship> = [];

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

        verifyContent(voivodeships);

        const watermark = `${moment().format('YYYY-MM-D')} - ${source}`;
        const hostitals = new Hostitals(watermark, voivodeships);

        const storage = new Storage();
        const bucket = storage.bucket(config.buckets.cdn);

        const file = bucket.file('hospitals.json');
        await file.save(JSON.stringify(hostitals));

    } catch (exception) {
        throw new Error(exception);
    }
};

export default hospitalsParser;
