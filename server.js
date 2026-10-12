
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ==================== DATABASE SCHEMAS ====================

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [String],
    answer: Number,
    explanation: String
});

const Question = mongoose.models.Question ||
    mongoose.model("Question", questionSchema);

const interviewSchema = new mongoose.Schema({
    category: String,
    question: String,
    answer: String
});

const Interview = mongoose.models.Interview ||
    mongoose.model("Interview", interviewSchema);

const codingSchema = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String
});

const Coding = mongoose.models.Coding ||
    mongoose.model("Coding", codingSchema);

const progressSchema = new mongoose.Schema({
    name: { type: String, default: "main" },
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 }
});

const Progress = mongoose.models.Progress ||
    mongoose.model("Progress", progressSchema);

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: String,
    questions: [{
        question: String,
        answer: String
    }]
}, { collection: "companies" });

const Company = mongoose.models.Company ||
    mongoose.model("Company", companySchema);

// ==================== SAMPLE APTITUDE QUESTIONS ====================

const sampleQuestions = [
    {
        question: "What is 20% of 150?",
        options: ["20", "25", "30", "35"],
        answer: 2,
        explanation: "20% of 150 = 30."
    },
    {
        question: "Find the next number: 2, 4, 6, 8, ?",
        options: ["9", "10", "12", "14"],
        answer: 1,
        explanation: "Each number increases by 2. The answer is 10."
    },
    {
        question: "A person travels 60 km in 2 hours. What is the speed?",
        options: ["20 km/h", "25 km/h", "30 km/h", "40 km/h"],
        answer: 2,
        explanation: "Speed = Distance / Time = 30 km/h."
    },
    {
        question: "What is the average of 10, 20, and 30?",
        options: ["15", "20", "25", "30"],
        answer: 1,
        explanation: "Average = (10 + 20 + 30) / 3 = 20."
    },
    {
        question: "If a pen costs ₹10, what is the cost of 5 pens?",
        options: ["₹15", "₹25", "₹40", "₹50"],
        answer: 3,
        explanation: "Total cost = ₹10 × 5 = ₹50."
    }
];

// ==================== SAMPLE INTERVIEW QUESTIONS ====================

const sampleInterviews = [
    {
        category: "HR Interview",
        question: "Tell me about yourself.",
        answer: "Introduce your education, skills, projects, strengths, and career goals."
    },
    {
        category: "HR Interview",
        question: "What are your strengths?",
        answer: "Mention strengths such as teamwork, problem-solving, and willingness to learn."
    },
    {
        category: "Technical Interview",
        question: "What is OOP?",
        answer: "OOP organizes code using classes and objects. Its main concepts are encapsulation, inheritance, polymorphism, and abstraction."
    },
    {
        category: "Technical Interview",
        question: "What is a database?",
        answer: "A database is an organized collection of data."
    },
    {
        category: "Technical Interview",
        question: "What is an API?",
        answer: "An API allows different software applications to communicate."
    }
];

// ==================== SAMPLE CODING QUESTIONS ====================

const sampleCoding = [
    {
        title: "Reverse a String",
        description: "Write a program to reverse a string.",
        difficulty: "Easy"
    },
    {
        title: "Check Even or Odd",
        description: "Determine whether a number is even or odd.",
        difficulty: "Easy"
    },
    {
        title: "Find the Largest Number",
        description: "Find the largest element in an array.",
        difficulty: "Easy"
    },
    {
        title: "Fibonacci Series",
        description: "Print the first N numbers of the Fibonacci series.",
        difficulty: "Medium"
    },
    {
        title: "Check Palindrome",
        description: "Check whether a string reads the same forward and backward.",
        difficulty: "Medium"
    }
];

// ==================== SAMPLE COMPANY QUESTIONS ====================
// These are practice questions, not verified company interview questions.

const sampleCompanies = [
    {
        name: "Google",
        role: "Software Engineer",
        questions: [
            {
                question: "What is a data structure?",
                answer: "A data structure organizes data efficiently. Examples include arrays, stacks, queues, trees, and graphs."
            },
            {
                question: "What is the time complexity of binary search?",
                answer: "Binary search takes O(log n) time on sorted data."
            },
            {
                question: "What is the difference between a stack and a queue?",
                answer: "A stack follows LIFO, while a queue follows FIFO."
            }
        ]
    },
    {
        name: "Microsoft",
        role: "Software Engineer",
        questions: [
            {
                question: "What is the difference between a process and a thread?",
                answer: "A process is a running program. Threads are units of execution within a process."
            },
            {
                question: "What is a deadlock?",
                answer: "A deadlock occurs when processes wait indefinitely for resources held by one another."
            },
            {
                question: "What is object-oriented programming?",
                answer: "OOP organizes code using classes and objects."
            }
        ]
    },
    {
        name: "Capgemini",
        role: "Software Engineer",
        questions: [
            {
                question: "What is the difference between C and C++?",
                answer: "C is primarily procedural, while C++ supports procedural and object-oriented programming."
            },
            {
                question: "What is inheritance in Java?",
                answer: "Inheritance allows a class to acquire properties and methods from another class using extends."
            },
            {
                question: "What is normalization in DBMS?",
                answer: "Normalization organizes database tables to reduce duplication."
            }
        ]
    },
    {
        name: "TCS",
        role: "Software Developer",
        questions: [
            {
                question: "What is OOP?",
                answer: "OOP means Object-Oriented Programming."
            },
            {
                question: "What is a primary key?",
                answer: "A primary key uniquely identifies each record in a database table."
            },
            {
                question: "What is an array?",
                answer: "An array stores elements using indexed positions."
            }
        ]
    },
    {
        name: "Infosys",
        role: "System Engineer",
        questions: [
            {
                question: "What is DBMS?",
                answer: "DBMS stands for Database Management System."
            },
            {
                question: "What is inheritance?",
                answer: "Inheritance allows one class to acquire properties and methods from another class."
            },
            {
                question: "What is an algorithm?",
                answer: "An algorithm is a sequence of steps used to solve a problem."
            }
        ]
    },
    {
        name: "Wipro",
        role: "Project Engineer",
        questions: [
            {
                question: "What is a loop?",
                answer: "A loop repeats a block of code."
            },
            {
                question: "What is SQL?",
                answer: "SQL is used to manage data in relational databases."
            },
            {
                question: "What is a Python list?",
                answer: "A list is an ordered, mutable collection of elements in Python."
            }
        ]
    },
    {
        name: "Accenture",
        role: "Associate Software Engineer",
        questions: [
            {
                question: "What is a function?",
                answer: "A function is a reusable block of code."
            },
            {
                question: "What is an exception?",
                answer: "An exception is an event that interrupts the normal flow of a program."
            },
            {
                question: "What is the difference between HTTP and HTTPS?",
                answer: "HTTPS encrypts communication between a browser and a server."
            }
        ]
    }
];

const memoryProgress = {
    attempted: 0,
    correct: 0
};

// ==================== SEED DATABASE ====================

async function seedDatabase() {
    if (await Question.countDocuments() === 0) {
        await Question.insertMany(sampleQuestions);
    }

    if (await Interview.countDocuments() === 0) {
        await Interview.insertMany(sampleInterviews);
    }

    if (await Coding.countDocuments() === 0) {
        await Coding.insertMany(sampleCoding);
    }

    // Add missing sample companies without overwriting existing data.
    for (const company of sampleCompanies) {
        await Company.updateOne(
            { name: company.name },
            { $setOnInsert: company },
            { upsert: true }
        );
    }

    await Progress.updateOne(
        { name: "main" },
        { $setOnInsert: { attempted: 0, correct: 0 } },
        { upsert: true }
    );

    console.log("Sample data is ready in MongoDB.");
}

// ==================== API HOME ====================

app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to the Placement Preparation Portal API"
    });
});

// ==================== GET APTITUDE QUESTIONS ====================

app.get("/api/aptitude", async (req, res) => {
    try {
        let questions;

        if (mongoose.connection.readyState === 1) {
            questions = await Question.find().lean();
        } else {
            questions = sampleQuestions.map((q, i) => ({
                ...q,
                _id: `sample-${i}`
            }));
        }

        // Hide answers until a student submits an answer.
        res.json(questions.map(({ answer, ...q }) => q));
    } catch (error) {
        console.error("Aptitude error:", error);
        res.status(500).json({
            message: "Unable to load aptitude questions."
        });
    }
});

// ==================== CHECK APTITUDE ANSWER ====================

app.post("/api/aptitude/:id/answer", async (req, res) => {
    try {
        const { selectedAnswer } = req.body;

        if (!Number.isInteger(selectedAnswer)) {
            return res.status(400).json({
                message: "Select a valid answer."
            });
        }

        let question;

        if (mongoose.connection.readyState === 1) {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(404).json({
                    message: "Question not found."
                });
            }

            question = await Question.findById(req.params.id);
        } else {
            const index = Number(req.params.id.replace("sample-", ""));
            question = Number.isInteger(index) ? sampleQuestions[index] : null;
        }

        if (!question) {
            return res.status(404).json({
                message: "Question not found."
            });
        }

        if (
            selectedAnswer < 0 ||
            selectedAnswer >= question.options.length
        ) {
            return res.status(400).json({
                message: "Invalid answer option."
            });
        }

        res.json({
            isCorrect: selectedAnswer === question.answer,
            explanation: question.explanation
        });
    } catch (error) {
        console.error("Answer checking error:", error);
        res.status(500).json({
            message: "Unable to check the answer."
        });
    }
});

// ==================== SEARCH COMPANIES ====================

app.get("/api/companies", async (req, res) => {
    try {
        const search = (req.query.q || "").trim();

        if (!search) {
            return res.json([]);
        }

        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(escaped, "i");

        if (mongoose.connection.readyState === 1) {
            const companies = await Company.find({
                $or: [
                    { name: pattern },
                    { "questions.question": pattern },
                    { "questions.answer": pattern }
                ]
            }).lean();

            if (companies.length > 0) {
                return res.json(companies);
            }

            console.log("No database matches; checking sample companies.");
        }

        // Use sample data if MongoDB has no matching companies.
        const matches = sampleCompanies.filter(company =>
            pattern.test(company.name) ||
            company.questions.some(item =>
                pattern.test(item.question) ||
                pattern.test(item.answer)
            )
        );

        return res.json(matches);
    } catch (error) {
        console.error("Company search error:", error);
        res.status(500).json({
            message: "Unable to search companies.",
            error: error.message
        });
    }
});

// ==================== GET INTERVIEW QUESTIONS ====================

app.get("/api/interviews", async (req, res) => {
    try {
        const data = mongoose.connection.readyState === 1
            ? await Interview.find().lean()
            : sampleInterviews;

        res.json(data);
    } catch (error) {
        console.error("Interview error:", error);
        res.status(500).json({
            message: "Unable to load interview questions."
        });
    }
});

// ==================== GET CODING PROBLEMS ====================

app.get("/api/coding", async (req, res) => {
    try {
        const data = mongoose.connection.readyState === 1
            ? await Coding.find().lean()
            : sampleCoding;

        res.json(data);
    } catch (error) {
        console.error("Coding error:", error);
        res.status(500).json({
            message: "Unable to load coding problems."
        });
    }
});

// ==================== GET STUDENT PROGRESS ====================

app.get("/api/progress", async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const data = await Progress.findOne({ name: "main" }).lean();

            return res.json({
                attempted: data?.attempted || 0,
                correct: data?.correct || 0
            });
        }

        res.json(memoryProgress);
    } catch (error) {
        console.error("Progress loading error:", error);
        res.status(500).json({
            message: "Unable to load progress."
        });
    }
});

// ==================== SAVE STUDENT PROGRESS ====================

app.post("/api/progress", async (req, res) => {
    try {
        const { questionId, isCorrect } = req.body;

        if (
            typeof questionId !== "string" ||
            typeof isCorrect !== "boolean"
        ) {
            return res.status(400).json({
                message: "Invalid progress data."
            });
        }

        if (mongoose.connection.readyState === 1) {
            if (!mongoose.isValidObjectId(questionId)) {
                return res.status(404).json({
                    message: "Question not found."
                });
            }

            const question = await Question.findById(questionId);

            if (!question) {
                return res.status(404).json({
                    message: "Question not found."
                });
            }

            const data = await Progress.findOneAndUpdate(
                { name: "main" },
                {
                    $inc: {
                        attempted: 1,
                        correct: isCorrect ? 1 : 0
                    },
                    $setOnInsert: { name: "main" }
                },
                { upsert: true, new: true }
            );

            return res.json({
                attempted: data.attempted,
                correct: data.correct
            });
        }

        memoryProgress.attempted++;

        if (isCorrect) {
            memoryProgress.correct++;
        }

        res.json(memoryProgress);
    } catch (error) {
        console.error("Progress saving error:", error);
        res.status(500).json({
            message: "Unable to save progress."
        });
    }
});

// ==================== START SERVER ====================

async function startServer() {
    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("MongoDB connected successfully.");
            await seedDatabase();
        } catch (error) {
            console.error("MongoDB connection failed:", error.message);
            console.log("Starting in demo mode with temporary sample data.");
        }
    } else {
        console.log("MONGODB_URI is missing. Starting in demo mode.");
    }

    const server = app.listen(PORT, () => {
        console.log("Placement Portal is running!");
        console.log(
            `Open this link: http://localhost:${server.address().port}`
        );
    });

    server.on("error", error => {
        if (error.code === "EADDRINUSE") {
            console.error(
                `Port ${PORT} is already in use. Stop the other server with Ctrl+C or change PORT in .env.`
            );
        } else {
            console.error("Server error:", error.message);
        }
    });
}

startServer();
