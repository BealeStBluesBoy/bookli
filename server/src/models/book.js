const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const db = require('../db.js');

//Estado disponible
const AVAILABLE = 'AVAILABLE';

//Estado leyendo
const READING = 'READING';

//Estado terminado
const FINISHED = 'FINISHED';

const status = {
    AVAILABLE,
    READING,
    FINISHED,
};

//calificacion 1
const uno = '1';

//calificacion 2
const dos = '2';

//calificacion 3
const tres = '3';

//calificacion 4
const cuatro = '4';

//calificacion 5
const cinco = '5';

/**
 * Modelo de libro.
 *
 *
 */
const Book = db.define(
    'Book',
    {
        // Atributos
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        synopsis: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        publisher: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isbn: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        genres: {
            type: Sequelize.JSON,
        },
        authors: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        cover: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: [AVAILABLE, READING, FINISHED],
        },
        rate: {
            type: Sequelize.ENUM,
            allowNull: true,
            values: [uno, dos, tres, cuatro, cinco]
        }
    },
    { tableName: 'Book' }
);

/**
 * Obtener todos los libros de la base de datos.
 * Parámetro filter: string de búsqueda que puede coincidir con
 * los atributos title, isbn o publisher
 *
 */
const getAllBooks = (filter, status) => {
    let where = {};

    if (filter) {
        const like = {
            [Op.like]: '%' + filter + '%',
        };

        where = {
            [Op.or]: [
                {
                    title: like,
                },
                {
                    isbn: like,
                },
                {
                    publisher: like,
                },
            ],
        };
    }

    if (status) {
        where = {
            ...where,
            status: status,
        };
    }

    return Book.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: where,
    });
};

/**
 * Crear un libro nuevo.
 * Parámetro data: JSON con los atributos a crear.
 * Si no se especifica el status, se crea como AVAILABLE (disponible).
 *
 */
const createBook = (data) => {
    if (!Object.prototype.hasOwnProperty.call(data, 'status')) {
        data = { ...data, status: AVAILABLE };
    }

    return Book.create(data);
};

/**
 * Obtener un libro de la base de datos por id.
 * Parámetro id: id a buscar en la base de datos.
 *
 */
const getBook = (id) => Book.findOne({ where: { id: id } });

/**
 *Cambia el rate de un libro a 5
 * Parametro id:id a buscar en la bd
 */

 const rateBookCinco = (id) => {
     return Book.findOne({ where: { id: id } }).then((book) =>{
        if (book != null) {
            return book.update({ rate: cinco });
        }
        return null;
     });
 };

 /**
 *Cambia el rate de un libro a 4
 * Parametro id:id a buscar en la bd
 */

const rateBookCuatro = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) =>{
       if (book != null) {
           return book.update({ rate: cuatro });
       }
       return null;
    });
};

/**
 *Cambia el rate de un libro a 3
 * Parametro id:id a buscar en la bd
 */

const rateBookTres = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) =>{
       if (book != null) {
           return book.update({ rate: tres });
       }
       return null;
    });
};

/**
 *Cambia el rate de un libro a 2
 * Parametro id:id a buscar en la bd
 */

const rateBookDos = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) =>{
       if (book != null) {
           return book.update({ rate: dos });
       }
       return null;
    });
};

/**
 *Cambia el rate de un libro a 1
 * Parametro id:id a buscar en la bd
 */

const rateBookUno = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) =>{
       if (book != null) {
           return book.update({ rate: uno });
       }
       return null;
    });
};

/**
 * Cambiar el estado de un libro a READING (leyendo).
 * Parámetro id: id a buscar en la base de datos.
 *
 */
const startBook = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) => {
        if (book != null) {
            return book.update({ status: READING });
        }
        return null;
    });
};

/**
 * Cambiar el estado de un libro a AVAILABLE (disponible) sólo si su estado es READING (leyendo).
 * Parámetro id: id a buscar en la base de datos.
 *
 */
const makeBookAvailable = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) => {
        if (book != null) {
            if (book.status !== READING) {
                return book;
            }
            return book.update({ status: AVAILABLE });
        }
        return null;
    });
};

/**
 * Cambiar el estado de un libro a FINISHED (terminado) sólo si su estado es READING (leyendo).
 * Parámetro id: id a buscar en la base de datos.
 *
 */
const finishBook = (id) => {
    return Book.findOne({ where: { id: id } }).then((book) => {
        if (book != null) {
            if (book.status !== READING) {
                return book;
            }
            return book.update({ status: FINISHED });
        }
        return null;
    });
};

const BookModel = {
    Book: Book,
    status: status,
    getAll: getAllBooks,
    create: createBook,
    get: getBook,
    start: startBook,
    makeAvailable: makeBookAvailable,
    finish: finishBook,
    rate1: rateBookUno,
    rate2: rateBookDos,
    rate3: rateBookTres,
    rate4: rateBookCuatro,
    rate5: rateBookCinco,
};

module.exports = BookModel;
