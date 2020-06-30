const fixture = require('../../scripts/fixture.js');
const startServer = require('../../server/src/index.js');
const BookModels = require('../../server/src/models/book.js');

let BASE_URL;
let server;

before(async(browser, done) => {
    server = await startServer();

    BASE_URL = `http://localhost:${server.address().port}`;
    done();
});

beforeEach(async(browser, done) => {
    await BookModels.Book.sync({ force: true });
    await fixture.initBooks();
    done();
});

after(() => {
    server.close();
});

describe('Home Test', () => {
    test('Deberia mostrar opacidad cuando se pone el mause sobre una tarjeta', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist')
            .moveToElement(
                'body > main > div > div.books-container > div > a:nth-child(1)',
                10,
                10,
            )
            .assert.cssProperty(
                'body > main > div > div.books-container > div > a:nth-child(1)',
                'opacity',
                '0.5'
            )

    });

    test('Deberia tener borde rojos las cards', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist')
            .assert.cssProperty(
                'body > main > div > div.books-container > div > a:nth-child(1) > div',
                'border',
                '1px solid rgb(204, 0, 0)'
            )

    });

    test('Deberia tener de titulo Bookli', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .assert.titleContains('Bookli');
    });

    test('Deberia mostrar el logo de Bookli', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.brand__logo')
            .assert.attributeContains(
                '.brand__logo',
                'src',
                '/assets/logo.svg'
            );
    });

    test('Deberia redireccionar a la pagina de libros de Amazon cuando presiono el boton Comprar', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body');

        browser
            .click('.comprar-btn')
            .pause(600)
            
        browser.expect
            .url().to.equal('https://www.amazon.es/gp/browse.html?node=599364031');
    });

    test('Deberia redireccionar a la pagina principal cuando presiono el logo de Bookli', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.brand')
            .assert.attributeEquals(
                '.brand',
                'href',
                (BASE_URL + '/')
            );
    });

    test('Deberia redireccionar a la pagina principal cuando presiono el logo de Bookli (otra forma)', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body');

        browser
            .click('.brand [data-ref=inicio]')
            .pause(400)
            .waitForElementVisible('body');

        browser.expect
            .url().to.equal(BASE_URL + '/');
    });

    test('Deberia mostrar el placeholder en el boton de busqueda', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('body > header > div.search > input')
            .assert.attributeContains(
                'body > header > div.search > input',
                'placeholder',
                'Buscar...'

            );
    });

    test('Deberia mostrar la lista de libros', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist .book')
            .assert.elementPresent('.booklist .book');
    });

    test('Deberia poder encontrar un libro por titulo', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist .book')
            .click('.search__input')
            .keys('Operaci')
            .pause(400)
            .expect.elements('.booklist .book')
            .count.to.equal(1);
    });

    test('Deberia mostrar un mensaje cuando no se encuentra un libro', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('body')
            .waitForElementVisible('.booklist .book')
            .click('.search__input')
            .keys('No existe')
            .pause(400);

        browser.expect.elements('.booklist .book').count.to.equal(0);
        browser.expect
            .element('.booklist.booklist--empty p')
            .text.to.equal(
                'Hmmm... Parece que no tenemos el libro que buscas.\nProba con otra busqueda.'
            );
    });

    test('Deberia mostrar el numero de libros segun el filtro aplicado en la etiqueda de Cantidad de libros', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]')
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]')
            .click('.book__actions [data-ref=addToFinish]')
            .pause(400)
            .waitForElementVisible(
                '.book__actions [data-ref=removeFromFinish]');
        browser
            .url(BASE_URL + '/detail/2')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]')
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]')
            .click('.book__actions [data-ref=addToFinish]')
            .pause(400)
            .waitForElementVisible(
                '.book__actions [data-ref=removeFromFinish]');
        browser
            .url(BASE_URL)
            .click('body > main > div > div.filters-container > form > label:nth-child(3) > div')
            .waitForElementVisible('#cant > strong');
           
        browser.expect
            .element('#cant > strong')
            .text.to.equal('2');
    });
});

describe('Detail view', () => {
    test('Deberia mostrar el pais de un libro', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__body')

        browser.expect
            .element('body > main > div > div.book__body > div > p:nth-child(2) > span')
            .text.to.equal('Argentina')
    });

    test('Deberia mostrar el isbn de un libro', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__body')

        browser.expect
            .element('body > main > div > div.book__body > div > p:nth-child(4)')
            .text.to.equal('ISBN: 9788499089515.')
    });

    test('Deberia mostrar boton para agregar a lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser.expect
            .element('.book__actions [data-ref=addToList]')
            .text.to.equal('Empezar a leer');
    });

    test('Deberia mostrar boton para remover libro de la lista de lectura si el libro es parte de la lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(1000)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=removeFromList]')
            .text.to.equal('Dejar de leer');
    });

    test('Deberia poder remover libro de la lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=removeFromList]')
            .text.to.equal('Dejar de leer');

        browser
            .click('.book__actions [data-ref=removeFromList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser.expect
            .element('.book__actions [data-ref=addToList]')
            .text.to.equal('Empezar a leer');
    });

    test('Deberia poder finalizar un libro de la lista de lectura', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=addToFinish]')
            .text.to.equal('Lo termine!');

        browser
            .click('.book__actions [data-ref=addToFinish]')
            .pause(400)
            .waitForElementVisible(
                '.book__actions [data-ref=removeFromFinish]'
            );

        browser.expect
            .element('.book__actions [data-ref=removeFromFinish]')
            .text.to.equal('Volver a leer');
    });

    test('Deberia poder calificar un libro terminado', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=removeFromList]');

        browser.expect
            .element('.book__actions [data-ref=addToFinish]')
            .text.to.equal('Lo termine!');

        browser
            .click('.book__actions [data-ref=addToFinish]')
            .pause(400)


        browser.expect
            .element('#popup > h3')
            .text.to.equal('Califica el libro por favor');

        browser
            .click('#popup > form > div > label:nth-child(2)')
            .pause(1000)
            .waitForElementVisible(
                '.book__actions [data-ref=removeFromFinish]'
            );
        browser.expect
            .element('.book__actions [data-ref=removeFromFinish]')
            .text.to.equal('Volver a leer');

    });

    test('Deberian aparecer botones "Dejar de leer" y "Lo termine"', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('body')
            .waitForElementVisible('.book__actions [data-ref=addToList]');

        browser
            .click('.book__actions [data-ref=addToList]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=addToFinish]');

        browser
            .click('.book__actions [data-ref=addToFinish]')
            .pause(400)
            .waitForElementVisible('#popup > form > div > label:nth-child(2)');

        browser
            .click('#popup > form > div > label:nth-child(2)')
            .pause(1000)
            .waitForElementVisible('.book__actions [data-ref=removeFromFinish]');

        browser
            .click('.book__actions [data-ref=removeFromFinish]')
            .pause(400)
            .waitForElementVisible('.book__actions [data-ref=addToFinish]');

        browser.expect
            .element('.book__actions [data-ref=addToFinish]')
            .text.to.equal('Lo termine!');

        browser.expect
            .element('.book__actions [data-ref=removeFromList]')
            .text.to.equal('Dejar de leer');
    });

    test('Deberia volver a la pagina principal', browser => {
        browser
            .url(BASE_URL + '/detail/1')
            .waitForElementVisible('.book__actions [data-ref=goBack]')

        browser
            .click('.book__actions [data-ref=goBack]')
            .pause(400)
            .waitForElementVisible('body');

        browser.expect
            .url().to.equal(BASE_URL + '/');
    });

    test('El texto de los estados de libros deberia tener el color correcto', browser => {
        browser
            .url(BASE_URL)
            .waitForElementVisible('div.filters-container > form > label:nth-child(1)')

        browser.assert
            .cssProperty('div.filters-container > form > label:nth-child(1)', 'color', 'rgba(26, 32, 44, 1)');
    });
});