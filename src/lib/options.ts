interface IClingyOptions {
    caseSensitive: boolean;
    validQuotes: string[];
}

const optionsDefault: IClingyOptions = {
    /**
     * If names should be treated case-sensitive for lookup.
     */
    caseSensitive: true,
    /**
     * List of characters to allow as quote-enclosing string.
     * If set to null, quotes-enclosed strings will be disabled.
     */
    validQuotes: ['"']
};

export { IClingyOptions, optionsDefault };
