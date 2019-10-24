import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    // Saving a new User
    const user: IUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.password = await user.encryptPassword(user.password); //Encripto la contraseña original y la misma es devuelta
    const savedUser = await user.save();

    // Token
    const token:string = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET || 'token_secret');

    res.header('auth_token', token).json(savedUser);

};

export const signin = (req: Request, res: Response) => {
    res.send('signin');
};

export const profile = (req: Request, res: Response) => {
    res.send('profile');
};