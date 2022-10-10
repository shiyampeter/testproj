var express = require('express');
var router = express.Router();
const {
	AuthController,
    StudentController,
    SubjectController,
    ExamtypeController,
    ExamController

} = require("../app/controllers/admin");
const {
	adminAuthMiddleware
} = require('../app/middleware/admin-jwt')

const upload = require('../app/middleware/upload')

router.post('/auth/login', AuthController.login);
//router.post('/auth/register',upload.single('image'), AuthController.register);
router.post('/auth/register',upload.array('image[]'), AuthController.register);
router.get('/auth/me', adminAuthMiddleware, AuthController.getMe);
router.post('/forgetpassword',AuthController.ForgetpasswordSend);
router.post('/forgetpassword-verify',AuthController.ForgetPasswordVerify);


router.post('/student/store', adminAuthMiddleware, StudentController.store);
router.get('/student/viewpage', adminAuthMiddleware, StudentController.viewpage);
router.get('/student/viewbyname/:name?/:rno?', adminAuthMiddleware, StudentController.viewbyname);
router.patch('/student/update/:id', adminAuthMiddleware, StudentController.update);
router.delete('/student/erase/:id', adminAuthMiddleware, StudentController.erase);
router.get('/student/viewone/:id', adminAuthMiddleware, StudentController.viewone);




router.get('/examtype/viewall',adminAuthMiddleware,ExamtypeController.viewall);
router.post('/examtype/store',adminAuthMiddleware,ExamtypeController.store);
router.patch('/examtype/update/:id',adminAuthMiddleware,ExamtypeController.update);
router.delete('/examtype/erase/:id',adminAuthMiddleware,ExamtypeController.erase);
router.get('/examtype/viewone/:id',adminAuthMiddleware,ExamtypeController.viewone);


router.get('/subject/viewall', adminAuthMiddleware,SubjectController.viewall);
router.post('/subject/store',adminAuthMiddleware,SubjectController.store);
router.patch('/subject/update/:id', adminAuthMiddleware,SubjectController.update);
router.delete('/subject/erase/:id', adminAuthMiddleware,SubjectController.erase);
router.get('/subject/viewaggregate', adminAuthMiddleware,SubjectController.viewaggregate);
router.get('/subject/viewone/:id', adminAuthMiddleware,SubjectController.viewone);


router.get('/exam/viewall', adminAuthMiddleware,ExamController.viewall);
router.post('/exam/store',adminAuthMiddleware,ExamController.store);
router.patch('/exam/update/:id',adminAuthMiddleware,ExamController.update);
router.delete('/exam/erase/:id',adminAuthMiddleware,ExamController.erase);
router.get('/exam/viewone/:id',adminAuthMiddleware,ExamController.viewone);
router.get('/exam/viewdetail/:stid/:exid',adminAuthMiddleware,ExamController.viewdetail);



module.exports = router;
