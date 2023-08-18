const fs = require('fs');

const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString
  }

  filter() {
    const queryObj = {...this.queryString}
    const excludedFields = ["page", 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
  
    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, match => `$${match}`)
  
    this.query.find(JSON.parse(queryStr));
  }
}

exports.getAllTours = async (req, res) => {
  console.log(req.query);

  try {
  //    // 1A) Filtering
  // const queryObj = {...req.query}
  // const excludedFields = ["page", 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // // 1B) Advanced Filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, match => `$${match}`)

  // let query =  Tour.find(JSON.parse(queryStr));

  

  // 2) Sorting
  if(req.query.sort) {
    const sortBy = req.query.sort.split(",").join(' ')
    console.log(sortBy)
    query = query.sort(sortBy);
  }

  // 3) Field Limiting
  if(req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  }

  //4) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit || 0;

  if (req.query.page) {
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error("This page does not exist");
  }

  const 

  query = query.skip(skip).limit(limit);
  // const tours = await Tour.find().where("duration").equals(5).where("difficulty").equals("easy")

  const tours = await query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }


 
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = Object.assign({ id: newID }, req.body);
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: 'null',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
