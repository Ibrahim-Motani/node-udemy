const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan(`dev`));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ message: 'Invalid id', status: 'fail' });
  }

  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

// routes
// tour-router
const tourRouter = express.Router();
// this process is called mounting a new router on a route '/api/v1/tours' is the route and tourRouter is a router
app.use(`/api/v1/tours`, tourRouter);
tourRouter
  .route(`/`)
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route(`/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// user-router
const userRouter = express.Router(`/api/v1/users`);
userRouter
  .route(`/`)
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route(`/:id`)
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3003;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});