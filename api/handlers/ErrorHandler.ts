export default interface ErrorHandler {
    handle(err: any): Error | void;
}
