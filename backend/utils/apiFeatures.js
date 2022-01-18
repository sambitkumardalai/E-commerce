class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryString };
    //===== removing some fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((element) => delete queryCopy[element]);
    // ==== filter for price and category
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = (currentPage - 1) * resultPerPage;
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
