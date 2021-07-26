/* eslint-disable require-jsdoc */
const {nanoid} = require('nanoid');
const books = require('./books');
const {UndefinedName, ErrorReadPage, NotFound} = require('./errors');


const addBookHandler = async (request, h) => {
  try {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    if (name === undefined) {
      throw new UndefinedName();
    }

    if (readPage > pageCount) {
      throw new ErrorReadPage();
    }

    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    await books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }).code(201);
    }
  } catch (err) {
    if (err instanceof UndefinedName) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
    } else if (err instanceof ErrorReadPage) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    } else {
      return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      }).code(500);
    }
  }
};

const getAllBookHandler = async (request, h) => {
  try {
    const {name, reading, finished} = request.query;

    if (name !== undefined) {
      return h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.name
                  .toLowerCase()
                  .includes(name.toLowerCase()))
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      }).code(200);
    }
    if (reading === '0') {
      return h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.reading === false)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      }).code(200);
    } else if (reading === '1') {
      return h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.reading === true)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      }).code(200);
    }

    if (finished === '0') {
      return h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.finished === false)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      }).code(200);
    } else if (finished === '1') {
      return h.response({
        status: 'success',
        data: {
          books: books
              .filter((book) => book.finished === true)
              .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
        },
      }).code(200);
    }

    return h.response({
      status: 'success',
      data: {
        books: books
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
      },
    }).code(200);
  } catch (err) {
    console.log(err.message);
  }
};

const getBookByIdHandler = async (request, h) => {
  try {
    const {bookId} = request.params;

    const book = await books
        .filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }

    throw new NotFound();
  } catch (e) {
    if (e instanceof NotFound) {
      return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      }).code(404);
    } else {
      console.log(e.message);
    }
  }
};

const updateBookHandler = async (request, h) => {
  try {
    const {bookId} = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage ? true : false;

    if (name === undefined) {
      throw new UndefinedName();
    }

    if (readPage > pageCount) {
      throw new ErrorReadPage();
    }

    const index = await books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
      };

      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      }).code(200);
    }

    throw new NotFound();
  } catch (e) {
    if (e instanceof UndefinedName) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
    } else if (e instanceof ErrorReadPage) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    } else if (e instanceof NotFound) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
    } else {
      console.log(e.message);
    }
  }
};

const deleteBookByIdHandler = async (request, h) => {
  try {
    const {bookId} = request.params;

    const index = await books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books.splice(index, 1);

      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      }).code(200);
    }

    throw new NotFound();
  } catch (e) {
    if (e instanceof NotFound) {
      return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      }).code(404);
    }
  }
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookByIdHandler,
};
