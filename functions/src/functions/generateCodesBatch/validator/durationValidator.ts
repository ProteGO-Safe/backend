const isValidDuration = (duration : number): boolean => {
    return duration === 1800 || (duration % 3600) === 0 && duration <= 86400 && duration > 0;
}

export default isValidDuration;
