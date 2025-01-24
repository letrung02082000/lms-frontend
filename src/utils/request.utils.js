const serializeQuery = (query) => {
    return Object.keys(query).map((key) => `${key}=${query[key]}`).join('&');
}

export { serializeQuery };