import { Router } from "express";
import bcrypt from 'bcryptjs';
import { emailExists, saveUser, getAllUsers, getUserById, updateUser } from '../models/auth/register.js';
import { findUserByEmail, verifyPassword } from '../models/auth/login.js';
// TODO import validation models

const router = Router();

const registrationValidation = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.redirect('/register');
  next();
};

const loginValidation = (req, res, next) => {
  if (!req.body.email || !req.body.password) return res.redirect('/login');
  next();
};

// Registration controllers

// display registration page
const showRegistrationPage = (req, res) => {
  res.render('auth/registration', {
    title: 'Registration Page'
  });
}

// register user function
const processRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailValid = await emailExists(email);
    if (emailValid) {
      console.warn('Email is already registered');
      res.redirect('/register');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await saveUser(name, email, hashedPassword);
    console.log('User registered successfully');
    return res.redirect('/login')
  } catch (error) {
    console.error('Error registering user:', error);
    res.redirect('/register');
  }
};

// Edit controllers
const showEditAccountForm = async (req, res) => {
  const targetUserId = parseInt(req.params.id);
  const currentUser = req.session.user;

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    console.error('User not found.');
    return res.redirect('/register/list');
  }

  const canEdit = currentUser.id === targetUserId || currentUser.roleName === 'admin';
  if (!canEdit) {
    console.error('You do not have permission to edit this account.');
    return res.redirect('/register/list');
  }

  res.render('forms/registration/edit', {
    title: 'Edit Account',
    user: targetUser
  });
};

const processEditAccount = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      console.error(error.msg);
    });
    return res.redirect(`/register/${req.params.id}/edit`);
  }

  const targetUserId = parseInt(req.params.id);
  const currentUser = req.session.user;
  const { name, email } = req.body;

  try {
    const targetUser = await getUserById(targetUserId);

    if (!targetUser) {
      console.error('User not found.');
      return res.redirect('/register/list');
    }

    // Check permissions
    const canEdit = currentUser.id === targetUserId || currentUser.roleName === 'admin';

    if (!canEdit) {
      console.error('You do not have permission to edit this account.');
      return res.redirect('/register/list');
    }

    const emailTaken = await emailExists(email);
    if (emailTaken && targetUser.email !== email) {
      console.error('An account with this email already exists.');
      return res.redirect(`/register/${targetUserId}/edit`);
    }

    await updateUser(targetUserId, name, email);
    if (currentUser.id === targetUserId) {
      req.session.user.name = name;
      req.session.user.email = email;
    }

    console.log('Account updated successfully.');
    res.redirect('/register/list');
  } catch (error) {
    console.error('Error updating account:', error);
    res.redirect(`/register/${targetUserId}/edit`);
  }
};

// Login controllers

// display page
const showLoginPage = (req, res) => {
  res.render('auth/login', {
    title: 'Login Page'
  })
}

const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      console.error('Invalid email or password');
      return res.redirect('/login');
    }

    const passwordVerified = await verifyPassword(password, user.password);
    if (passwordVerified == false) {
      console.error("Invalid email or password");
      return res.redirect('/login');
    }
    delete user.password;
    req.session.user = user;
    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error with processing login', error);
    return res.redirect('/login');
  }
};

export const processLogout = (req, res) => {
  if (!req.session) {
    return res.redirect('/');
  }
  // Call destroy() to remove this session from the store (PostgreSQL in our case)
  req.session.destroy((err) => {
    if (err) {
        console.error('Error destroying session:', err);
        res.clearCookie('connect.sid');
        return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

export const showDashboard = (req, res) => {
  const user = req.session.user;
  const sessionData = req.session;

  if (user && user.password) {
      console.error('Security error: password found in user object');
      delete user.password;
  }
  if (sessionData.user && sessionData.user.password) {
      console.error('Security error: password found in sessionData.user');
      delete sessionData.user.password;
  }

  res.render('dashboard', {
    title: 'Dashboard',
    user,
    sessionData
  });
};

// Router get/posts
router.get('/', showRegistrationPage);
router.post('/', registrationValidation, processRegistration);
// TODO implement edit router pushes
router.get('/', showLoginPage);
router.post('/', loginValidation, processLogin);

export default router;
