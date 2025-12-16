export const simulateDelay = <T>(data: T, minMs = 300, maxMs = 800): Promise<T> => {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export const mockError = (message = "Mock API Error"): Promise<never> => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), 500));
};

export const isMockMode = (): boolean => {
    return process.env.NEXT_PUBLIC_USE_MOCK === 'true';
};
