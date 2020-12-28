const fetchErrorMessage = (e: any) => {
    if (e.response && e.response.error) {
        return e.response.error.text
    }
    return null;
};

export default fetchErrorMessage;