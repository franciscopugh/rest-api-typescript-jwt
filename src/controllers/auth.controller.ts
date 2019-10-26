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

export const signin = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).json('The email entered is not registered');
    
    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if(!correctPassword) return res.status(400).json('The password entered is not valid');

    const token: string = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET || 'token_secret',{
        expiresIn: 60 * 60 * 24     //El token vence en un dia
    });
    res.header('auth-token', token).json(user);
};

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId);

    if(!user) return res.status(404).json('No user found');
    res.json(user);

};