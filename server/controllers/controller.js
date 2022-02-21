const modelsTasks = require('../models/model.js')
class Tasks {
    read(req, res) {
        const read = modelsTasks.read();
        read.then(data => res.json(data))
            .catch(() => res.status(500).json())
    }
    create(req, res) {
        const { name, description, done, due_date } = req.body;
        const create = modelsTasks.create(name, description, done, due_date)
        create.then((data) => res.json(data[0])
        )
            .catch(error => console.log(error))
    }
    remove(req, res) {
        const taskId = req.body.id
        const getTask = modelsTasks.getById(taskId)
        getTask.then((data) => {
            if (data[0]) {
                const replace = modelsTasks.remove(taskId)
                replace.then(data => res.json(data))
                    .catch(() => res.status(500).json())
            } else { res.status(404).json({ error: 'Task not found' }) }
        })
            .catch(() => res.status(500).json())
    }
    updateDone(req, res) {
        const taskId = req.body.id;
        const done = req.body.done;
        const getTask = modelsTasks.getById(taskId)
        getTask.then((data) => {
            if (data[0]) {
                const update = modelsTasks.update(taskId,done)
                update.then(data => res.json(data))
                    .catch(() => res.status(500).json())
            } else { res.status(404).json({ error: 'Task not found' }) }
        })
            .catch(() => res.status(500).json())
    }
}

module.exports = new Tasks()