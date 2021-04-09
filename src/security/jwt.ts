import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import {v4 as uuidv4} from 'uuid';

export class JWT {

    private static JWT_SECRET = "123456";

    public static async generateToken(user: User){
        //payload
        const payload ={
            id: user.id,
            email: user.email
        }

        //secret key jwt generation
        const token = jwt.sign(payload, this.JWT_SECRET,{
            expiresIn: "1h", //expiry time 1 hour
            jwtid: uuidv4(),
            subject: user.id.toString() //subject should be user id
        });

        //jwt token for refresh token

        //link that token

        return token;

    }
}