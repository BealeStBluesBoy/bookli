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

/**
 * Modelo de libro.
 *
 *
 */
const Book = db.define(
    'Book', {
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
            allowNull: false,
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

        country: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        pages: {
            type: Sequelize.INTEGER,
        },

        rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            values: [0, 1, 2, 3, 4, 5]
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
            [Op.or]: [{
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
        data = {...data, status: AVAILABLE };
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

/**
 * Cambiar el rating de un libro solo si esta en FINISHED (terminado).
 * Parámetro id: id a buscar en la base de datos.
 * Parametro rating: rating a guardar.
 *
 */
const rateBook = (id, rating) => {
    return Book.findOne({ where: { id: id } }).then((book) => {
        if (book != null) {
            if (book.status !== FINISHED) {
                return book;
            }
            return book.update({ rating: rating });
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
    rate: rateBook
};

module.exports = BookModel;