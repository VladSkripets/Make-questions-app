import { Question } from './question'
import { createModal, isValid } from './utils';
import './style.css'
import { authWithEmailAndPass, getAuthForm } from './auth';


const form = document.querySelector('#form');
const modalBtn = document.querySelector('#modal-btn');
const input = form.querySelector('#qustion-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', Question.renderList);


modalBtn.addEventListener('click', openModal);
form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
});

function submitFormHandler(event) {
    event.preventDefault()
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true

        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}

function openModal() {
    createModal('Authorization', getAuthForm());
    document.querySelector('#auth-form').addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPass(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Error', content)
    } else {
        createModal('Questions list', Question.listToHTML(content))
    }
}
