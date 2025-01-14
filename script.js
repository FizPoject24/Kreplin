let timerInterval;
        let questionIndex = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        const questions = [];
        const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
        
        // Generate 50 questions
        for (let i = 0; i < 50; i++) {
            const num1 = Math.floor(Math.random() * 10);
            const num2 = Math.floor(Math.random() * 10);
            questions.push({
                num1: num1,
                num2: num2,
                correctAnswer: num1 + num2
            });
        }
        
        function showTimeSelect() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('time-select').style.display = 'block';
        }
        
        function startQuiz(timeLimit) {
            questionIndex = 0;
            correctCount = 0;
            incorrectCount = 0;
        
            document.getElementById('time-select').style.display = 'none';
            document.getElementById('quiz-title').style.display = 'none';
            document.getElementById('timer').innerText = `Time left: ${timeLimit} Detik`;
            document.getElementById('timer').style.display = 'block';
            document.getElementById('question').style.display = 'block';
            document.getElementById('options').style.display = 'block';
        
            timerInterval = setInterval(() => {
                timeLimit--;
                document.getElementById('timer').innerText = `Waktu: ${timeLimit} Detik`;
        
                if (timeLimit <= 0) {
                    endQuiz();
                }
            }, 1000);
        
            displayQuestion();
        }
        
        function displayQuestion() {
            if (questionIndex >= questions.length) {
                endQuiz();
                return;
            }
        
            const currentQuestion = questions[questionIndex];
            document.getElementById('question').innerText = `Berapa ${currentQuestion.num1} + ${currentQuestion.num2}?`;
            const options = document.getElementById('options');
            options.innerHTML = '';
        
            const answers = [
                currentQuestion.correctAnswer,
                currentQuestion.correctAnswer + 1,
                currentQuestion.correctAnswer - 1,
                currentQuestion.correctAnswer + 2
            ].sort(() => Math.random() - 0.5);
        
            answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer;
                button.onclick = () => checkAnswer(answer);
                options.appendChild(button);
            });
        }
        
        function checkAnswer(selectedAnswer) {
            const currentQuestion = questions[questionIndex];
        
            if (selectedAnswer === currentQuestion.correctAnswer) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        
            questionIndex++;
            displayQuestion();
        }
        
        function endQuiz() {
            clearInterval(timerInterval);
        
            const result = {
                date: new Date().toLocaleString(),
                score: `${correctCount} Correct, ${incorrectCount} Incorrect`
            };
        
            // Ensure the history array does not exceed 10 entries
            if (history.length >= 10) {
                history.shift(); // Remove the oldest entry
            }
        
            history.push(result); // Add the new quiz result
            localStorage.setItem('quizHistory', JSON.stringify(history)); // Save updated history to local storage
            updateHistory();
        
            const container = document.querySelector('.container');
            container.innerHTML = `<h1>Quiz Complete!</h1>
                <p>You answered ${correctCount} correctly and ${incorrectCount} incorrectly.</p>
                <button onclick="location.reload()">Back to Menu</button>`;
        }
        
        function updateHistory() {
            const historyContent = document.getElementById('history-content');
            historyContent.innerHTML = '';
        
            if (history.length === 0) {
                const row = document.createElement('tr');
                const emptyCell = document.createElement('td');
                emptyCell.colSpan = 2;
                emptyCell.innerText = 'No history available';
                row.appendChild(emptyCell);
                historyContent.appendChild(row);
            } else {
                history.forEach(entry => {
                    const row = document.createElement('tr');
                    const dateCell = document.createElement('td');
                    const scoreCell = document.createElement('td');
                    dateCell.innerText = entry.date;
                    scoreCell.innerText = entry.score;
                    row.appendChild(dateCell);
                    row.appendChild(scoreCell);
                    historyContent.appendChild(row);
                });
            }
        }
        
        function showHistory() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('time-select').style.display = 'none';
            document.getElementById('history').style.display = 'block';
            updateHistory();
        }
        
        function returnToMenu() {
            document.getElementById('history').style.display = 'none';
            document.getElementById('main-menu').style.display = 'block';
        }
        
        function deleteHistory() {
            // Remove the history from local storage permanently
            localStorage.removeItem('quizHistory');
            
            // Clear the history table immediately
            const historyContent = document.getElementById('history-content');
            historyContent.innerHTML = '';  // Remove all rows from the table
            
            // Add a message indicating that the history has been deleted
            const row = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 2;
            emptyCell.innerText = 'History has been permanently deleted.';
            row.appendChild(emptyCell);
            historyContent.appendChild(row);
        }