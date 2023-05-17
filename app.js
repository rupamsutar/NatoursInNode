// const express = require('express');
// const fs = require("fs");
// const app = express();
// // app.use(express.json());

// const port = 8000;
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

// // app.get("/", (req, res) => {
// //     res.json({message: "hello from the server side", statusCode: 200});
// // })

// // app.post("/", (req, res) => {
// //     res.send("Posting the data")
// // })

// app.get("/api/v1/tours", (req, res) => {
//     res.status(200).json({
//         status: "success",
//         results: tours.length,
//         data: {
//             tours: tours
//         }
//     })
// });

// app.post("/api/v1/tours", (req,res) => {
//     console.log(req.body);
//     res.send("Done");
// });

// app.listen(port, () => {
//     console.log(`app is running on port ${port}...`);
// })

const fs = require('fs');
const express = require('express');
const app = express();

//adding middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

const port = 8000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getLandingPage = (req, res) => {
  res
    .status(200)
    .json({ message: 'Get req accepted on the landing page.', status: 200 });
};

const getTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getATour = (req, res) => {
  console.log(req.params);

  const tour = tours.find((el) => el.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
app.get('/', getLandingPage);
app.get('/api/v1/tours', getTours);
app.post('/api/v1/tours', createTour);
app.get('/api/v1/tours/:id', getATour);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
