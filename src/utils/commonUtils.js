const convertToDateTime = (_date, hasTime, hyphen=' ') => {
    let date = new Date(_date);
    return `${date?.toLocaleDateString()}${hyphen}${date?.toLocaleTimeString()}`
}

export { convertToDateTime }