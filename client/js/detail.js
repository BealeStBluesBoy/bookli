import { getRefs, render } from './utils.js';
import bookService from './book-service.js';

const refs = getRefs();

const state = {
    book: null,
};
const calificar = 0;



/**
 * Obtiene el id de un libro a partir de un path
 **/
function getBookId(str) {
    const result = /detail\/(\d+)/.exec(str);

    if (result) {
        return result[1];
    }
}


/**
 * Agrega un libro a la lista de lectura
 *
 * Actualiza el libro y la UI
 **/
async function addToReadingList() {
    await bookService.rateBook(state.book.id, calificar.value);
    state.book = await bookService.get(state.book.id);


    await bookService.startBook(state.book.id);
    state.book = await bookService.get(state.book.id);
    renderBook(state.book);
}

/**
 * Quita un libro de la lista de lectura
 *
 * Actualiza el libro y la UI
 **/
async function removeFromReadingList() {
    await bookService.makeBookAvailable(state.book.id);
    state.book = await bookService.get(state.book.id);

    renderBook(state.book);
}

async function addToFinishList() {
    await bookService.finishBook(state.book.id);
    state.book = await bookService.get(state.book.id);

    renderBook(state.book);
}


async function goBack() {
    history.length > 1 ? window.history.back() : window.close();
}

async function rateDetailBook(e) {
    await bookService.rateBook(state.book.id, e.target.value);
    state.book = await bookService.get(state.book.id);

    renderBook(state.book);
}

/**
 * Actualiza la UI
 **/
function renderBook(book) {
    const bookRefs = render(
        'book.html', {
            book: book,
            detail: true,
        },
        refs.main
    );

    if (book.status === 'AVAILABLE') {
        bookRefs.addToList.addEventListener('click', addToReadingList);
    }

    if (book.status === 'READING') {
        bookRefs.removeFromList.addEventListener('click', removeFromReadingList);
        bookRefs.addToFinish.addEventListener('click', addToFinishList);
    }

    if (book.status === 'FINISHED') {
        if (book.rating > 0) {
            bookRefs.removeFromFinish.addEventListener('click', addToReadingList);
            document.getElementById('ove').classList.remove('active');
            document.getElementById('popup').classList.remove('active');
        } else {
            document.getElementById('ove').classList.add('active');
            setTimeout(function() {
                document.getElementById('popup').classList.add('active');
            }, 300);
            document.getElementsByName("rate").forEach(element => {
                element.addEventListener('click', rateDetailBook);
                element.classList.remove("btn-selected");
            });
        }
    }

    bookRefs.goBack.addEventListener('click', goBack);
}

/**
 * Inicializa la vista
 **/
async function init() {
    const bookId = getBookId(window.location.pathname);
    state.book = await bookService.get(bookId);

    renderBook(state.book);
}

init();