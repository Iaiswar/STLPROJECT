export interface Question {
    id: number;
    question: string;
    choices: string[];
    answer: string;
}

export const questions: Question[] = [
    {
        id: 1,
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris"
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        choices: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        id: 3,
        question: "What is the largest mammal?",
        choices: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        answer: "Blue Whale"
    },
    {
        id: 4,
        question: "Which language is primarily used for web development?",
        choices: ["Java", "Python", "JavaScript", "C++"],
        answer: "JavaScript"
    },
    {
        id: 5,
        question: "What is the chemical symbol for gold?",
        choices: ["Go", "Gd", "Au", "Ag"],
        answer: "Au"
    },
    {
        id: 6,
        question: "Who painted the Mona Lisa?",
        choices: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: "Leonardo da Vinci"
    },
    {
        id: 7,
        question: "What is the hardest natural substance on Earth?",
        choices: ["Gold", "Iron", "Diamond", "Quartz"],
        answer: "Diamond"
    },
    {
        id: 8,
        question: "Which country is home to the kangaroo?",
        choices: ["New Zealand", "South Africa", "Australia", "Brazil"],
        answer: "Australia"
    },
    {
        id: 9,
        question: "What is the largest ocean on Earth?",
        choices: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean"
    },
    {
        id: 10,
        question: "Which year did World War II end?",
        choices: ["1943", "1945", "1947", "1950"],
        answer: "1945"
    }
];