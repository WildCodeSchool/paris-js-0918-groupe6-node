const express = require('express');

const Router = express.Router();
const models = require('../models');

Router.put('/', (req, res) => {
  const { missionId, traineeId, mode } = req.body;
  switch (mode) {
    case 'PRESELCT':
      models.Applications.findOne({
        where: {
          TraineeId: traineeId,
          MissionId: missionId
        }
      }).then(applicationFound => {
        if (applicationFound) {
          applicationFound.update({ preselection: true });
          applicationFound.save().then(result => res.status(200).json(result.dataValues));
        } else {
          res.status(404).json({
            error: 'Student already preselected '
          });
        }
      });
      break;
    case 'SELECT':
      models.Applications.findOne({
        where: {
          TraineeId: traineeId,
          MissionId: missionId
        }
      }).then(applicationFound => {
        if (applicationFound) {
          applicationFound.update({ selection: true });
          applicationFound.save().then(result => res.status(200).json(result.dataValues));
        } else {
          res.status(404).json({
            error: 'Student already preselected '
          });
        }
      });
      break;
    case 'REFUSSE':
      models.Applications.findOne({
        where: {
          TraineeId: traineeId,
          MissionId: missionId
        }
      }).then(applicationFound => {
        if (applicationFound) {
          applicationFound.update({ statusAppli: false });
          applicationFound.save().then(result => res.status(200).json(result.dataValues));
        } else {
          res.status(404).json({
            error: 'Student already preselected '
          });
        }
      });
      break;

    default:
      res.status(404).json({
        error: 'Select the mode '
      });
      break;
  }
});

/**
 * return the informations of the trainees
 * that candidate to missions of one company
 */
Router.get('/:id/:mode/mytrainee', (req, res) => {
  const { mode } = req.params;
  switch (mode) {
    case 'APPLICATION':
      models.Missions.findAll({
        where: { companyId: req.params.id }
      }).then(missionsFound => {
        if (missionsFound) {
          const data = [];
          let newPromise = null;
          missionsFound.map(element => {
            newPromise = models.Applications.findAll({
              where: { MissionId: element.dataValues.id, statusAppli: true, preselection: null },
              order: ['MissionId'],
              include: [
                {
                  model: models.Trainee,
                  attributes: ['firstname', 'pictures', 'address', 'town', 'postalCode'],
                  include: [
                    {
                      model: models.LevelStudies
                    },
                    {
                      model: models.Schools
                    }
                  ]
                }
              ]
            }).then(applicationFound => {
              if (applicationFound.length !== 0) {
                data.push({
                  mission_id: element.dataValues.id,
                  titleMission: element.dataValues.titleMission,
                  dataApplications: applicationFound
                });
              }
            });
          });
          Promise.all([newPromise]).then(() =>
            res.status(200).json({ company_id: req.params.id, data })
          );
        } else {
          res.status(404).json({ error: 'no application ' });
        }
      });
      break;
    case 'PRESELECT':
      models.Missions.findAll({
        where: { companyId: req.params.id }
      }).then(missionsFound => {
        if (missionsFound) {
          const data = [];
          let newPromise = null;
          missionsFound.map(element => {
            newPromise = models.Applications.findAll({
              where: { MissionId: element.dataValues.id, statusAppli: true, preselection: true },
              order: ['MissionId'],
              include: [
                {
                  model: models.Trainee,
                  attributes: ['firstname', 'pictures', 'address', 'town', 'postalCode'],
                  include: [
                    {
                      model: models.LevelStudies
                    },
                    {
                      model: models.Schools
                    }
                  ]
                }
              ]
            }).then(applicationFound => {
              if (applicationFound.length !== 0) {
                data.push({
                  mission_id: element.dataValues.id,
                  titleMission: element.dataValues.titleMission,
                  dataApplications: applicationFound
                });
              }
            });
          });
          Promise.all([newPromise]).then(() =>
            res.status(200).json({ company_id: req.params.id, data })
          );
        } else {
          res.status(404).json({ error: 'no application ' });
        }
      });
      break;
    case 'SELECT':
      models.Missions.findAll({
        where: { companyId: req.params.id }
      }).then(missionsFound => {
        if (missionsFound) {
          const data = [];
          let newPromise = null;
          missionsFound.map(element => {
            newPromise = models.Applications.findAll({
              where: { MissionId: element.dataValues.id, selection: true },
              order: ['MissionId'],
              include: [
                {
                  model: models.Trainee,
                  attributes: ['firstname', 'pictures', 'address', 'town', 'postalCode'],
                  include: [
                    {
                      model: models.LevelStudies
                    },
                    {
                      model: models.Schools
                    }
                  ]
                }
              ]
            }).then(applicationFound => {
              if (applicationFound.length !== 0) {
                data.push({
                  mission_id: element.dataValues.id,
                  titleMission: element.dataValues.titleMission,
                  dataApplications: applicationFound
                });
              }
            });
          });
          Promise.all([newPromise]).then(() =>
            res.status(200).json({ company_id: req.params.id, data })
          );
        } else {
          res.status(404).json({ error: 'no application ' });
        }
      });
      break;
    default:
      res.status(404).json({ error: 'select the mode' });
      break;
  }
});
// Route Company afficher les liens entrre trainee et mission
Router.get('/company', (req, res) => {
  // const { traineeId } = req.body;
  const missionId = 1;

  models.Applications.findAll({
    where: {
      MissionId: missionId
    },
    include: [
      {
        model: models.Trainee
      }
    ]
  }).then(applicationFound => {
    if (applicationFound) {
      res.status(200).json(applicationFound);
    } else {
      res.status(404).json({
        error: 'no application '
      });
    }
  });
});

Router.post('/', (req, res) => {
  const { missionId, traineeId } = req.body;
  models.Applications.findOne({
    where: {
      TraineeId: traineeId,
      MissionId: missionId
    }
  }).then(applicationFound => {
    if (!applicationFound) {
      const applicationForm = new models.Applications({
        statusAppli: true,
        MissionId: missionId,
        TraineeId: traineeId
      });
      applicationForm.save();
      res.status(200).json({ Application: applicationForm.dataValues });
    } else {
      res.status(404).json({
        error: 'user already candidate'
      });
    }
  });
});

module.exports = Router;
