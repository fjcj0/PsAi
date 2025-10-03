interface AIMessage {
    role: string;
    content?: string;
    image?: string;
}

interface AIChoice {
    message: AIMessage;
}

interface AIResponse {
    choices: AIChoice[];
}