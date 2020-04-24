const BASE_URL = '/api/v1';

async function getAll() {
    const resp = await fetch(`${BASE_URL}/books`);
    return await resp.json();
}

async function search(query, status) {
    const searchParams = new URLSearchParams();
    query && searchParams.set('query', query);
    status && searchParams.set('status', status);

    const resp = await fetch(`${BASE_URL}/books?${searchParams}`);
    return await resp.json();
}

async function get(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}`);
    return await resp.json();
}

async function startBook(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/start`, {
        method: 'PUT',
    });
    return resp;
}

async function makeBookAvailable(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/available`, {
        method: 'PUT',
    });
    return resp;
}

async function finishBook(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/finish`, {
        method: 'PUT',
    });
    return resp;
}

async function rateBookUno(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/1`, {
        method: 'PUT',
    });
    return resp;
}

async function rateBookDos(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/2`, {
        method: 'PUT',
    });
    return resp;
}

async function rateBookTres(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/3`, {
        method: 'PUT',
    });
    return resp;
}

async function rateBookCuatro(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/4`, {
        method: 'PUT',
    });
    return resp;
}

async function rateBookCinco(id) {
    const resp = await fetch(`${BASE_URL}/books/${id}/5`, {
        method: 'PUT',
    });
    return resp;
}
export default {
    getAll,
    get,
    search,
    startBook,
    finishBook,
    makeBookAvailable,
    rateBookUno,
    rateBookDos,
    rateBookTres,
    rateBookCuatro,
    rateBookCinco,
};
