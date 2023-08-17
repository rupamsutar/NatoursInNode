const fs = require('fs');

const Tour = require('./../models/tourModel');

exports.getAllTours = async(req, res) => {
  const tours = await Tour.find();  
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    },
  });
};

exports.getTour = async(req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    })
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
      status: "fail",
      message: "Invalid Data Sent"
    })
  }
};

exports.updateTour = (req, res) => {
  //   if (req.params.id * 1 > tours.length) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'UPDATED TOUR HERE !',
    },
  });
};

exports.deleteTour = (req, res) => {
  //   if (req.params.id * 1 > tours.length) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

  res.status(204).json({
    status: 'success',
    data: isNull,
  });
};
