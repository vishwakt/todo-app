const express = require('express')
const Task = require('../models/task_model')
const auth = require('../middleware/auth')
const router = new express.Router()

/**
 * * POST method to create task
 */
router.post('/projects', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * * GET method to view all tasks
 */
router.get('/projects', auth, async (req, res) => {

    try {
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

/**
 * * GET method to view a single task
 */
router.get('/projects/:id', auth, async (req, res) => {
    const _id = req.params.id

    const task = await Task.findOne({ _id, owner: req.user._id })
    try {

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})

/**
 * * PATCH method to update a single task
 */
router.patch('/projects/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * * DELETE method to view a single task
 */
router.delete('/projects/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router