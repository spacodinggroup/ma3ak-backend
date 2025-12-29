const normalizeAIResponse = (raw) => {
    // Extraction priority (top → bottom)
    // 1. raw.reply
    if (raw?.reply && typeof raw.reply === 'string')
        return raw.reply;
    // 2. raw.message
    if (raw?.message && typeof raw.message === 'string')
        return raw.message;
    // 3. raw.data?.reply
    if (raw?.data?.reply && typeof raw.data.reply === 'string')
        return raw.data.reply;
    // 4. raw.data?.message
    if (raw?.data?.message && typeof raw.data.message === 'string')
        return raw.data.message;
    // 5. raw.choices?.[0]?.message?.content
    if (raw?.choices?.[0]?.message?.content && typeof raw.choices[0].message.content === 'string') {
        return raw.choices[0].message.content;
    }
    // 6. raw.text
    if (raw?.text && typeof raw.text === 'string')
        return raw.text;
    // If raw is JSON string → parse & retry
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            // Recursively check the parsed object (but prevent infinite loop if parsed is same string)
            if (typeof parsed === 'object' && parsed !== null) {
                return normalizeAIResponse(parsed);
            }
        }
        catch (e) {
            // If raw is plain string -> return it (last resort for string input that isn't JSON)
            if (raw.trim().length > 0)
                return raw;
        }
    }
    return "";
};
// Test cases
const runTests = () => {
    console.log("Running Tests...");
    const cases = [
        { name: "Direct Reply", input: { reply: "Hello" }, expected: "Hello" },
        { name: "Direct Message", input: { message: "Hello" }, expected: "Hello" },
        { name: "Data Reply", input: { data: { reply: "Hello" } }, expected: "Hello" },
        { name: "Data Message", input: { data: { message: "Hello" } }, expected: "Hello" },
        { name: "OpenAI Style", input: { choices: [{ message: { content: "Hello" } }] }, expected: "Hello" },
        { name: "Text Field", input: { text: "Hello" }, expected: "Hello" },
        { name: "JSON String", input: '{"reply": "Hello"}', expected: "Hello" },
        { name: "Plain String", input: "Hello World", expected: "Hello World" },
        { name: "Empty String", input: "", expected: "" },
        { name: "Null", input: null, expected: "" },
        { name: "Undefined", input: undefined, expected: "" },
        { name: "Empty Object", input: {}, expected: "" },
        { name: "Nested JSON String", input: '{"data": {"message": "Hello"}}', expected: "Hello" }
    ];
    let passed = 0;
    cases.forEach(c => {
        const result = normalizeAIResponse(c.input);
        if (result === c.expected) {
            console.log(`[PASS] ${c.name}`);
            passed++;
        }
        else {
            console.error(`[FAIL] ${c.name}. Expected "${c.expected}", got "${result}"`);
        }
    });
    console.log(`Passed ${passed}/${cases.length}`);
};
runTests();
export {};
//# sourceMappingURL=test-normalizer-temp.js.map