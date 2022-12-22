class queryHandler {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    /* ==> (1B)
      Advanced filtering:
      {difficulty: 'easy', duration:{$gte:5}} -> in MongoDB
      {difficulty: 'easy', duration:{gte:5}} -> in our query bcoz we passed duration[gte]=5
      gt,gte,lt,lte
      {difficulty: 'easy', duration:{$gte:5}} -> after the 3 lines of code below 
    */
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    if (this.queryString.page) {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 3;
      const skipDocs = (page - 1) * limit;

      this.query = this.query.skip(skipDocs).limit(limit);
    }

    return this;
  }
}

module.exports = queryHandler;
