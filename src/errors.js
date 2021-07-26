const UndefinedName = class extends Error {
  constructor(response) {
    super(response);
    this.name='ValidationError';
  }
};

const ErrorReadPage = class extends Error {
  constructor(response) {
    super(response);
    this.name='ErrorReadPage';
  }
};

const NotFound = class extends Error {
  constructor(response) {
    super(response);
    this.name='NotFound';
  }
};

module.exports ={
  UndefinedName,
  ErrorReadPage,
  NotFound,
};
