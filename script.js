
const quizArea = document.getElementById("quizArea");
const quizMessage = document.getElementById("quizMessage");

let questions = [];
let interviews = [];
let codingProblems = [];

let currentQuestion = 0;
let selectedAnswer = null;

let attempted = 0;
let correct = 0;

let sessionAttempted = 0;
let sessionCorrect = 0;
let sessionWrong = 0;

let answeredQuestions = new Set();


// ==================== LOAD DATA ====================

async function loadData() {
    try {
        const responses = await Promise.all([
            fetch("/api/aptitude"),
            fetch("/api/interviews"),
            fetch("/api/coding"),
            fetch("/api/progress")
        ]);

        if (responses.some(response => !response.ok)) {
            throw new Error("Unable to load portal data.");
        }

        const data = await Promise.all(
            responses.map(response => response.json())
        );

        questions = data[0];
        interviews = data[1];
        codingProblems = data[2];

        attempted = Number(data[3].attempted) || 0;
        correct = Number(data[3].correct) || 0;

        showQuestion();
        showInterviews(interviews);
        showCoding(codingProblems);
        updateProgress();
        updateSessionScore();

    } catch (error) {
        console.error("Loading error:", error);

        quizArea.textContent =
            "Unable to connect. Please start the Node.js server.";

        document.getElementById("interviewList").textContent =
            "Unable to load interview questions.";

        document.getElementById("codingList").textContent =
            "Unable to load coding problems.";
    }
}


// ==================== SHOW APTITUDE QUESTION ====================

function showQuestion() {
    quizMessage.textContent = "";
    selectedAnswer = null;

    if (questions.length === 0) {
        quizArea.textContent = "No aptitude questions available.";
        return;
    }

    if (currentQuestion >= questions.length) {
        quizArea.replaceChildren();

        const heading = document.createElement("h4");
        heading.className = "fw-bold text-success";
        heading.textContent = "Quiz Completed!";

        const summary = document.createElement("p");
        summary.textContent =
            `Attempted: ${sessionAttempted} | ` +
            `Correct: ${sessionCorrect} | ` +
            `Wrong: ${sessionWrong}`;

        const restartButton = document.createElement("button");
        restartButton.className = "btn btn-success mt-3";
        restartButton.textContent = "Practise Again";
        restartButton.type = "button";
        restartButton.addEventListener("click", restartQuiz);

        quizArea.append(heading, summary, restartButton);
        return;
    }

    const question = questions[currentQuestion];

    quizArea.replaceChildren();

    const heading = document.createElement("h5");
    heading.className = "fw-bold mb-3";
    heading.textContent =
        `Question ${currentQuestion + 1}: ${question.question}`;

    quizArea.appendChild(heading);

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "question-option";
        button.textContent = option;
        button.type = "button";

        button.addEventListener("click", () => {
            selectedAnswer = index;

            quizArea.querySelectorAll(".question-option")
                .forEach(item => {
                    item.classList.remove(
                        "border-primary",
                        "bg-primary",
                        "text-white"
                    );
                });

            button.classList.add(
                "border-primary",
                "bg-primary",
                "text-white"
            );
        });

        quizArea.appendChild(button);
    });

    const submitButton = document.createElement("button");

    submitButton.className = "btn btn-success mt-3";
    submitButton.textContent = "Submit Answer";
    submitButton.type = "button";
    submitButton.addEventListener("click", submitAnswer);

    quizArea.appendChild(submitButton);
}


// ==================== SUBMIT ANSWER ====================

async function submitAnswer() {
    if (selectedAnswer === null) {
        quizMessage.textContent = "Please select an answer first.";
        return;
    }

    const question = questions[currentQuestion];

    if (answeredQuestions.has(question._id)) {
        quizMessage.textContent =
            "You have already answered this question.";
        return;
    }

    const submitButton = quizArea.querySelector(".btn-success");

    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        const checkResponse = await fetch(
            `/api/aptitude/${question._id}/answer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    selectedAnswer: selectedAnswer
                })
            }
        );

        const result = await checkResponse.json();

        if (!checkResponse.ok) {
            throw new Error(
                result.message || "Unable to check the answer."
            );
        }

        const saveResponse = await fetch("/api/progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                questionId: question._id,
                isCorrect: result.isCorrect
            })
        });

        const saved = await saveResponse.json();

        if (!saveResponse.ok) {
            throw new Error(
                saved.message || "Unable to save progress."
            );
        }

        attempted = Number(saved.attempted) || 0;
        correct = Number(saved.correct) || 0;

        sessionAttempted++;

        if (result.isCorrect) {
            sessionCorrect++;
        } else {
            sessionWrong++;
        }

        answeredQuestions.add(question._id);

        quizMessage.textContent = result.isCorrect
            ? "Correct! " + (result.explanation || "")
            : "Incorrect. " + (result.explanation || "");

        updateProgress();
        updateSessionScore();

        quizArea.querySelectorAll(".question-option")
            .forEach(button => {
                button.disabled = true;
            });

        currentQuestion++;

        const nextButton = document.createElement("button");
        nextButton.className = "btn btn-success mt-3 ms-2";
        nextButton.textContent =
            currentQuestion < questions.length
                ? "Next Question"
                : "See Result";

        nextButton.addEventListener("click", showQuestion);

        quizArea.appendChild(nextButton);

    } catch (error) {
        quizMessage.textContent = error.message;

        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}


// ==================== RESTART QUIZ ====================

function restartQuiz() {
    currentQuestion = 0;
    selectedAnswer = null;

    sessionAttempted = 0;
    sessionCorrect = 0;
    sessionWrong = 0;

    answeredQuestions.clear();

    updateSessionScore();
    showQuestion();
}


// ==================== SHOW INTERVIEW QUESTIONS ====================

function showInterviews(items) {
    const list = document.getElementById("interviewList");

    list.replaceChildren();

    items.forEach(item => {
        const column = document.createElement("div");
        column.className = "col-md-6";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm p-3";

        const title = document.createElement("h5");
        title.className = "fw-bold";
        title.textContent = item.category || "Interview Question";

        const question = document.createElement("p");
        question.textContent = item.question || "";

        const answer = document.createElement("p");
        answer.className = "answer-box";
        answer.textContent =
            "Suggested answer: " + (item.answer || "");

        card.append(title, question, answer);
        column.appendChild(card);
        list.appendChild(column);
    });
}


// ==================== SHOW CODING PROBLEMS ====================

function showCoding(items) {
    const list = document.getElementById("codingList");

    list.replaceChildren();

    items.forEach(item => {
        const column = document.createElement("div");
        column.className = "col-md-6";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm p-3";

        const title = document.createElement("h5");
        title.className = "fw-bold";
        title.textContent = item.title || "Coding Problem";

        const description = document.createElement("p");
        description.textContent = item.description || "";

        const difficulty = document.createElement("span");
        difficulty.className =
            "badge text-bg-success align-self-start";
        difficulty.textContent = item.difficulty || "Practice";

        card.append(title, description, difficulty);
        column.appendChild(card);
        list.appendChild(column);
    });
}


// ==================== UPDATE OVERALL PROGRESS ====================

function updateProgress() {
    document.getElementById("attempted").textContent = attempted;
    document.getElementById("correct").textContent = correct;

    document.getElementById("wrong").textContent =
        Math.max(0, attempted - correct);

    const percentage = attempted === 0
        ? 0
        : Math.round((correct / attempted) * 100);

    const fill = document.getElementById("progressFill");
    const bar = document.getElementById("progressBar");

    fill.style.width = percentage + "%";
    fill.textContent = percentage + "%";

    bar.setAttribute("aria-valuenow", percentage);
}


// ==================== UPDATE SESSION SCORE ====================

function updateSessionScore() {
    const attemptedBox =
        document.getElementById("sessionAttempted");

    const correctBox =
        document.getElementById("sessionCorrect");

    const wrongBox =
        document.getElementById("sessionWrong");

    if (attemptedBox) {
        attemptedBox.textContent = sessionAttempted;
    }

    if (correctBox) {
        correctBox.textContent = sessionCorrect;
    }

    if (wrongBox) {
        wrongBox.textContent = sessionWrong;
    }
}


// ==================== SEARCH COMPANIES IN MONGODB ====================

async function searchCompanies(searchText) {
    const resultsBox =
        document.getElementById("companySearchResults");

    if (!resultsBox) {
        return;
    }

    resultsBox.replaceChildren();

    if (!searchText) {
        return;
    }

    const heading = document.createElement("h4");
    heading.className = "green-text fw-bold mb-3";
    heading.textContent = "Company Interview Questions";

    const loading = document.createElement("p");
    loading.textContent = "Searching companies...";

    resultsBox.append(heading, loading);

    try {
        const response = await fetch(
            `/api/companies?q=${encodeURIComponent(searchText)}`
        );

        const companies = await response.json();

        if (!response.ok) {
            throw new Error(
                companies.message || "Company search failed."
            );
        }

        resultsBox.replaceChildren();
        resultsBox.appendChild(heading);

        if (!Array.isArray(companies) || companies.length === 0) {
            const message = document.createElement("p");
            message.textContent =
                "No matching companies or company questions found.";

            resultsBox.appendChild(message);
            return;
        }

        companies.forEach(company => {
            const card = document.createElement("div");
            card.className = "feature-card p-4 mb-4 rounded-3";

            const title = document.createElement("h4");
            title.className = "green-text fw-bold";
            title.textContent = company.name || "Company";

            const role = document.createElement("p");
            role.textContent =
                "Role: " + (company.role || "Software Engineer");

            card.append(title, role);

            const companyQuestions = company.questions || [];

            if (companyQuestions.length === 0) {
                const message = document.createElement("p");
                message.textContent = "No questions added yet.";
                card.appendChild(message);
            }

            companyQuestions.forEach((item, index) => {
                const question = document.createElement("h6");
                question.className = "fw-bold mt-3";
                question.textContent =
                    `${index + 1}. ${item.question || "Question"}`;

                const answer = document.createElement("p");
                answer.textContent =
                    "Answer: " + (item.answer || "No answer added.");

                card.append(question, answer);
            });

            resultsBox.appendChild(card);
        });

    } catch (error) {
        console.error("Company search error:", error);

        resultsBox.replaceChildren();

        const message = document.createElement("p");
        message.className = "text-danger";
        message.textContent =
            "Unable to search companies. Check your Node.js server and MongoDB connection.";

        resultsBox.appendChild(message);
    }
}


// ==================== GENERAL PORTAL SEARCH ====================

async function searchPortal(event) {
    event.preventDefault();

    const input = document.getElementById("searchInput");
    const resultsBox = document.getElementById("searchResults");

    if (!input || !resultsBox) {
        return;
    }

    const searchText = input.value.trim().toLowerCase();

    resultsBox.replaceChildren();

    if (!searchText) {
        resultsBox.textContent = "Please enter a topic to search.";
        return;
    }

    const results = [];

    // Search aptitude questions
    questions.forEach((item, index) => {
        const text = (
            (item.question || "") + " " +
            (item.options || []).join(" ")
        ).toLowerCase();

        if (text.includes(searchText)) {
            results.push({
                title: "Aptitude: " + item.question,
                section: "aptitude",
                action: () => {
                    currentQuestion = index;
                    showQuestion();
                }
            });
        }
    });

    // Search interview questions
    interviews.forEach(item => {
        const text = (
            (item.category || "") + " " +
            (item.question || "") + " " +
            (item.answer || "")
        ).toLowerCase();

        if (text.includes(searchText)) {
            results.push({
                title: "Interview: " + item.question,
                section: "interview"
            });
        }
    });

    // Search coding problems
    codingProblems.forEach(item => {
        const text = (
            (item.title || "") + " " +
            (item.description || "") + " " +
            (item.difficulty || "")
        ).toLowerCase();

        if (text.includes(searchText)) {
            results.push({
                title: "Coding: " + item.title,
                section: "coding"
            });
        }
    });

    if (results.length === 0) {
        resultsBox.textContent =
            "No matching aptitude, interview, or coding topics found.";
    } else {
        const heading = document.createElement("h5");
        heading.className = "fw-bold mb-3";
        heading.textContent = "Other Search Results";

        resultsBox.appendChild(heading);

        results.forEach(result => {
            const link = document.createElement("a");

            link.href = "#" + result.section;
            link.className =
                "search-result-item d-block p-2 mb-2";

            link.textContent = result.title;

            link.addEventListener("click", () => {
                if (result.action) {
                    result.action();
                }
            });

            resultsBox.appendChild(link);
        });
    }

    // Also search company names and interview questions
    await searchCompanies(searchText);
}


// Connect the Explore button to both searches
const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", searchPortal);
}


// ==================== REFRESH PROGRESS AND RESTART QUIZ ====================

const refreshButton =
    document.getElementById("refreshProgress");

if (refreshButton) {
    refreshButton.addEventListener("click", async () => {
        refreshButton.disabled = true;

        try {
            const response = await fetch("/api/progress", {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Could not refresh progress.");
            }

            const data = await response.json();

            attempted = Number(data.attempted) || 0;
            correct = Number(data.correct) || 0;

            currentQuestion = 0;
            selectedAnswer = null;

            sessionAttempted = 0;
            sessionCorrect = 0;
            sessionWrong = 0;

            answeredQuestions.clear();

            updateProgress();
            updateSessionScore();
            showQuestion();

            quizMessage.textContent =
                "Progress refreshed. Quiz restarted from Question 1.";

        } catch (error) {
            quizMessage.textContent = error.message;

        } finally {
            refreshButton.disabled = false;
        }
    });
}


// ==================== START WEBSITE ====================

loadData();
