import express from 'express';
const router = express.Router();
const models = require('../models/index');
const { check, validationResult } = require('express-validator');


/**
 * Route untuk mengambil semua data artikel
 */
router.get('/getall', async function (req, res, next) {
    try {
        const dataPosts = await models.posts.findAll({});
        if (dataPosts.length !== 0) {
            res.json({
                'status': 200,
                'message': "success get data post",
                'data': dataPosts
            });
        } else {
            res.json({
                'status': 200,
                'message': "empty data",
                'data': {}
            });
        }
    } catch (ex) {
        res.status(500).json({
            'status': 500,
            'messages': ex.message
        })
    }
});

/**
 * Route untuk mengambil artikel berdasarkan ID
 */
router.get('/getpostbyid/:id', async function (req, res, next) {
    try {
        const id = req.params.id;
        const dataPost = await models.posts.findByPk(id);
        if (dataPost) {
            res.json({
                'status': 200,
                'messages': 'success get data post',
                'data': dataPost
            });
        } else {
            res.status(404).json({
                'status': 404,
                'messages': 'Data not found',
                'data': null
            });
        }

    } catch (error) {
        res.status(500).json({
            'status': 500,
            'messages': error.message
        })
    }
});

/**
 * Route untuk membuat artikel baru
 */
router.post('/add',[
    check('title').not().isEmpty().withMessage('title is required'),
    check('content').not().isEmpty().withMessage('content is required'),
    check('tags').not().isEmpty().withMessage('tags is required'),
    check('ispublished').not().isEmpty().withMessage('ispublished is required'),
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const { title, content, tags, ispublished } = req.body;
        const dataPost = await models.posts.create({
            title, content, tags, ispublished
        });
        if (dataPost) {
            res.status(200).json({
                'status': 200,
                'message': 'success add post',
                'data': dataPost
            });
        }
    } catch (error) {
        res.status(500).json({
            'status': 500,
            'messages': err.message
        });
    }
});

/**
 * Route untuk mengupdate artikel berdasarkan ID
 */
router.put('/update',[
    check('id').not().isEmpty().withMessage('id is required').isNumeric().withMessage('id must numeric')
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    try {
        const { id, title, content, tags, ispublished } = req.body;
        const dataPost = await models.posts.findByPk(id);
        const dataPostUpdate = dataPost.update({
            title, content, tags, ispublished
        }, {
            where: {
                id: id
            }
        });
        if (dataPostUpdate) {
            res.status(200).json({
                'status': 200,
                'message': 'success update post',
                'data': dataPost
            });
        }
    } catch (error) {
        res.status(500).json({
            'status': 500,
            'messages': err.message
        });
    }

});

/**
 * Route untuk menghapus artikel berdasarkan ID
 */
router.delete('/delete',[
    check('id').not().isEmpty().withMessage('id is required').isNumeric().withMessage('id must numeric')
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    try {
        const { id } = req.body;
        const dataPost = await models.posts.findByPk(id);
        const dataPostDelete = dataPost.destroy({
            where: {
                id: id
            }
        });
        if (dataPostDelete) {
            res.status(200).json({
                'status': 200,
                'message': 'success delete post'
            });
        }
    } catch (error) {
        res.status(500).json({
            'status': 500,
            'messages': err.message
        });
    }
});

export default router;