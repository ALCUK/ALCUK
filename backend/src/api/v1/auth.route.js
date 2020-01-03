import { Router } from 'express'
import { body } from 'express-validator'

import auth from '../../utils/auth'
import {
    databaseError,
    unexpectedError,
    validateParams,
    asyncRoute,
} from '../../utils/api'
import User from '../../models/User'

const router = Router()
router.loginNotRequired = true

router.route('/login').post(
    [body('username').isString(), body('password').isString(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            const user = await User.findOne()
                .where('username')
                .equals(req.body.username)

            if (user && user.checkPassword(req.body.password)) {
                const accessToken = await auth.createAccessToken(user)

                res.status(200).json({
                    accessToken,
                })
            } else {
                res.status(403).json({ message: '로그인 실패' })
            }
        } catch (error) {
            databaseError(res, error)
        }
    })
)

router.route('/register').post(
    [
        body('username').isString(),
        body('password').isString(),
        body('realname').isString(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        try {
            let idreg = /^[a-z0-9]{6,12}$/
            if (!idreg.test(req.body.username)) {
                res.status(400).json({
                    message:
                        '아이디는 6~12자의 영문 소문자, 숫자만 사용 가능합니다.',
                })
                return
            }

            let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,16}$/
            if (!pwreg.test(req.body.password)) {
                res.status(400).json({
                    message:
                        '비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요',
                })
                return
            }

            const exists = await User.count()
                .where('username')
                .equals(req.body.username)

            if (exists) {
                res.status(409).json({
                    message: '이미 사용중인 아이디입니다.',
                })
                return
            }

            const user = new User({
                username: req.body.username,
                password: req.body.password,
                info: {
                    realname: req.body.realname,
                },
            })
            await user.save()

            res.status(201).json({ message: 'success' })
        } catch (error) {
            unexpectedError(res, error)
        }
    })
)

router.route('/register/doublecheck/username').post(
    [body('username').isString(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            const exits = await User.count()
                .where('username')
                .equals(req.body.username)
            if (exits) {
                res.status(409).json({
                    message: '이미 사용중인 아이디입니다.',
                })
                return
            }
            res.status(200).end()
        } catch (error) {
            unexpectedError(res, error)
        }
    })
)

export default router
