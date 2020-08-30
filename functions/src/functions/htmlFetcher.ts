import axios from "axios";

export const fetchHtml = async (url: string) => {
    const response = await axios.get(url);

    const {data, status} = response;

    if (status !== 200) {
        throw new Error('Can not fetch html');
    }

    return data;
};
