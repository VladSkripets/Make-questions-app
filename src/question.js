export class Question {
    static create(question) {
        return fetch('https://Name-of-your-app.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            question.id = response.name
            return question
        })
        .then(addToLocalStorage)
        .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">There isn`t any token</p>')
        }
        return fetch(`https://makequestion-app-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
        .then(response => response.json())
        .then(response => {
            if (response && response.error) {
                return `<p class="error">${response.error}</p>`
            }
            return response ? Object.keys(response).map(key => ({
                ...response[key],
                id: key
            })) : []
        })
    }

    static renderList() {
        const questions = getQuestions();
        const html = questions.length ? questions.map(toCard).join('') : `<div class="mui--text-headline">You didn't ask anything!</div>`

        const list = document.querySelector('#list');
        list.innerHTML = html;
    }

    static listToHTML(questions) {
        return questions.length ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
        : `<p>There is no questions</p>`
    }

}

function addToLocalStorage(question) {
    const all = getQuestions()
    all.push(question)
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestions() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return `
        <div class="mui--text-black-54">
            ${new Date(question.date).toLocaleDateString()}
            ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div>${question.text}</div>
        <br>
    `
}
