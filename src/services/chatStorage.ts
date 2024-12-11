interface ChatMessage {
    content: string;
    isAi: boolean;
}

export function saveChatMessage(message: ChatMessage) {
    const history = getChatHistory();
    history.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

export function getChatHistory(): ChatMessage[] {
    const history = localStorage.getItem('chatHistory');
    return history ? JSON.parse(history) : [];
}

export function clearChatHistory() {
    localStorage.removeItem('chatHistory');
} 