module.exports = (sequelize, DataTypes) => {
  const Applications = sequelize.define(
    'Applications',
    {
      statusAppli: DataTypes.BOOLEAN,
      dateAppli: DataTypes.DATE,
      preselection: DataTypes.BOOLEAN,
      selection: DataTypes.BOOLEAN
    },
    {}
  );
  Applications.associate = models => {
    // associations can be defined here
    Applications.belongsTo(models.Missions, { constraints: true });
    Applications.belongsTo(models.Trainee, { constraints: true });
  };
  return Applications;
};
