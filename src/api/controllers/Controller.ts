interface URIMapping {
    [uri: string]: (...args: any[]) => any;
}

export default interface Controller {
    routes: {
        GET?: URIMapping,
        POST?: URIMapping,
        PUT?: URIMapping,
        DELETE?: URIMapping
    };
}
