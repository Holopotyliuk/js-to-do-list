const knex = require('../connection/index')
class Controller {
    getById(taskId) {
        return knex.select().from('task').where('id', taskId)
    }
    read() {
        return knex.select().from('task')
    }
    create(name, description, done, due_date) {
        return knex.insert({ name: name, description: description, done: done, due_date: due_date }, "*").into('task')
    }
    update(taskId, done) {
        return knex('task')
            .where('id', taskId)
            .update({ done: done }, "*")
    }
    remove(taskId) {
        return knex('task')
            .where('id', taskId)
            .del("*")
    }
}
module.exports = new Controller()
