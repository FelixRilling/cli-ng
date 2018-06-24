interface IClingyOptions {
    caseSensitive: boolean;
    validQuotes: string[];
}

const optionsDefault: IClingyOptions = {
    /**
     * If names should be treated case-sensitive for lookup.
     */
    caseSensitive: false,
    /**
     * List of characters to allow as quote-enclosing string.
     */
    validQuotes: ["\"", "“", "”"]
};

export { IClingyOptions, optionsDefault };
