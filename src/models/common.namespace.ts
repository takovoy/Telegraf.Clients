export namespace Common {
    export type Dictionary<ValueType> = {[key: string]: ValueType}
    export type Func<ArgType, OutType> = (arg: ArgType) => OutType;
}