const express = require('express');

const Router = express.Router();

const models = require('../models');

// Router.post('/', (req, res) => {

// });
Router.get('/', (req, res) => {
  res.status(200).json({ message: 'hello to my world' });
});

Router.post('/', (req, res) => {
  // get id_user and id_mission
  const { MissionId, TraineeId } = req.body;
  console.log('Id_mission', MissionId);
  console.log('id_trainee', TraineeId);
  // const applicationForm = new models.Applications({
  //   statusAppli: true,
  //   MissionId,
  //   TraineeId
  // });
  // applicationForm.save();
  // res.status(200).json({ messga: 'application created' });

  models.Applications.findOne({
    where: { TraineeId, MissionId }
  }).then(applicationFound => {
    if (!applicationFound) {
      const applicationForm = new models.Applications({
        statusAppli: true,
        MissionId,
        TraineeId
      });
      applicationForm.save();
      res.status(200).json({ messga: 'application created' });
    } else {
      res.status(404).json({ error: 'user already candidate' });
    }
  });
});

module.exports = Router;
