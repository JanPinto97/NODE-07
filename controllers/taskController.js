// controllers/taskController.js
const Task = require('../models/Task');

// Crear una nova tasca (assigna automàticament user = req.user._id)
exports.createTask = (req, res) => {
  const { title, description, cost, hours_estimated, hours_real, image, completed } = req.body;

  // Validacions bàsiques per camps obligatoris
  if (!title) {
    return res.status(400).json({ message: 'El camp "title" és obligatori.' });
  }
  if (cost === undefined) {
    return res.status(400).json({ message: 'El camp "cost" és obligatori.' });
  }
  if (hours_estimated === undefined) {
    return res.status(400).json({ message: 'El camp "hours_estimated" és obligatori.' });
  }

  const taskData = {
    title,
    description,
    cost,
    hours_estimated,
    hours_real,
    image,
    completed: completed === true, // per defecte false si no es passa
    user: req.user._id // ✅ IMPORTANT: propietari de la tasca (no ve del client)
  };

  // Si l'usuari crea la tasca ja marcada com a completada, establim finished_at
  if (taskData.completed) {
    taskData.finished_at = new Date();
  }

  Task.create(taskData)
    .then((task) => res.status(201).json(task))
    .catch((error) => {
      console.error('createTask error:', error);
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// Obtenir totes les tasques (només les del user autenticat)
exports.getAllTasks = (req, res) => {
  Task.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .then((tasks) => res.status(200).json(tasks))
    .catch((error) => {
      console.error('getAllTasks error:', error);
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// Obtenir una tasca per ID (només si és del propietari)
exports.getTaskById = (req, res) => {
  const { id } = req.params;

  Task.findOne({ _id: id, user: req.user._id })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Tasca no trobada.' });
      }
      res.status(200).json(task);
    })
    .catch((error) => {
      console.error('getTaskById error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tasca invàlid.' });
      }
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// Actualitzar una tasca per ID (només si és del propietari)
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  // Camps que permetem actualitzar
  const updatableFields = [
    'title',
    'description',
    'cost',
    'hours_estimated',
    'hours_real',
    'image',
    'completed',
    'finished_at'
  ];

  // Construim updateData només amb camps permesos (i MAI user)
  const updateData = {};
  updatableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      updateData[field] = updates[field];
    }
  });

  // Si completed s'ha enviat, gestionem finished_at automàticament (si no l'han passat explícit)
  if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
    const newCompleted = Boolean(updates.completed);

    if (newCompleted) {
      // Si no han passat finished_at, el posem ara
      if (!Object.prototype.hasOwnProperty.call(updates, 'finished_at')) {
        updateData.finished_at = new Date();
      }
    } else {
      // Si es marca com no completada, eliminem finished_at
      updateData.finished_at = undefined;
    }
  }

  Task.findOneAndUpdate({ _id: id, user: req.user._id }, updateData, { new: true })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Tasca no trobada.' });
      }
      res.status(200).json(task);
    })
    .catch((error) => {
      console.error('updateTask error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tasca invàlid.' });
      }
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// Eliminar una tasca per ID (només si és del propietari)
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  Task.findOneAndDelete({ _id: id, user: req.user._id })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Tasca no trobada.' });
      }
      res.status(200).json({ message: 'Tasca eliminada correctament.' });
    })
    .catch((error) => {
      console.error('deleteTask error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tasca invàlid.' });
      }
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// 🔄 Actualitzar només la imatge d'una tasca (només si és del propietari)
exports.updateTaskImage = (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Cal proporcionar una URL d’imatge.' });
  }

  Task.findOneAndUpdate({ _id: id, user: req.user._id }, { image }, { new: true })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Tasca no trobada.' });
      }
      res.json(task);
    })
    .catch((error) => {
      console.error('updateTaskImage error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tasca invàlid.' });
      }
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// 🔁 Reset imatge a null (només si és del propietari)
exports.resetTaskImageToDefault = (req, res) => {
  const { id } = req.params;

  Task.findOneAndUpdate({ _id: id, user: req.user._id }, { image: null }, { new: true })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Tasca no trobada.' });
      }
      res.json(task);
    })
    .catch((error) => {
      console.error('resetTaskImageToDefault error:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tasca invàlid.' });
      }
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};

// 📊 Estadístiques de tasques (només de l'usuari autenticat)
exports.getTaskStats = (req, res) => {
  Task.find({ user: req.user._id })
    .then((tasks) => {
      const totalTasks = tasks.length;

      const completedTasks = tasks.filter((t) => t.completed).length;
      const pendingTasks = totalTasks - completedTasks;

      const totalCost = tasks.reduce((sum, t) => sum + (t.cost || 0), 0);
      const completedTasksCost = tasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + (t.cost || 0), 0);
      const pendingTasksCost = totalCost - completedTasksCost;

      const averageCostPerTask = totalTasks ? totalCost / totalTasks : 0;
      const averageCostCompleted = completedTasks ? completedTasksCost / completedTasks : 0;
      const averageCostPending = pendingTasks ? pendingTasksCost / pendingTasks : 0;

      const totalHoursEstimated = tasks.reduce((sum, t) => sum + (t.hours_estimated || 0), 0);
      const totalHoursReal = tasks.reduce((sum, t) => sum + (t.hours_real || 0), 0);

      const timeEfficiency = totalHoursEstimated
        ? (totalHoursReal * 100) / totalHoursEstimated
        : 0;

      const averageHoursEstimated = totalTasks ? totalHoursEstimated / totalTasks : 0;
      const averageHoursReal = totalTasks ? totalHoursReal / totalTasks : 0;

      const hoursDifference = totalHoursReal - totalHoursEstimated;
      const hoursOverrun = hoursDifference > 0 ? hoursDifference : 0;
      const hoursSaved = hoursDifference < 0 ? -hoursDifference : 0;

      const tasksWithDescription = tasks.filter(
        (t) => t.description && t.description.trim() !== ''
      ).length;
      const tasksWithoutDescription = totalTasks - tasksWithDescription;

      res.json({
        success: true,
        data: {
          overview: {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate: totalTasks ? Number(((completedTasks * 100) / totalTasks).toFixed(2)) : 0
          },
          financial: {
            totalCost,
            completedTasksCost,
            pendingTasksCost,
            averageCostPerTask: Number(averageCostPerTask.toFixed(2)),
            averageCostCompleted: Number(averageCostCompleted.toFixed(2)),
            averageCostPending: Number(averageCostPending.toFixed(2))
          },
          time: {
            totalHoursEstimated,
            totalHoursReal,
            timeEfficiency: Number(timeEfficiency.toFixed(2)),
            averageHoursEstimated: Number(averageHoursEstimated.toFixed(2)),
            averageHoursReal: Number(averageHoursReal.toFixed(2)),
            hoursDifference,
            hoursOverrun,
            hoursSaved
          },
          productivity: {
            tasksWithDescription,
            tasksWithoutDescription
          }
        }
      });
    })
    .catch((error) => {
      console.error('getTaskStats error:', error);
      res.status(500).json({ message: 'Error intern del servidor.' });
    });
};
