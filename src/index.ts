import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from 'express';
import {Request, Response} from 'express';
import { RegisterDTO } from "./dto/request/register.dto";
import { Database } from "./database";
import { PasswordHash } from "./security/passwordhash";
import { AuthenticationDTO } from "./dto/response/authentication.dto";
import { UserDTO } from "./dto/response/user.dto";
import { JWT } from "./security/jwt";

const app = express();

app.use(express.json());

Database.initialize();

app.get("/", (req: Request, resp: Response ) =>{
    resp.send('hello world!')
});

app.post("/register", async (req: Request, resp: Response ) =>{

    try {
    const body: RegisterDTO = req.body;

    //validate the body   
    if(body.password !== body.repeatPassword)
     throw new Error('passwords do not match!')

    //validate if the email is already being used
    if(await Database.userRepository.findOne({email: body.email}))
     throw new Error('a user already exists with this email');
    
    //store the user
    const user = new User();

    user.username = body.username;
    user.email = body.email;
    //hashing passwords
    user.password = await PasswordHash.hashPasword(body.password);
    
    user.age = body.age;

    //saving user
    await Database.userRepository.save(user);

    const authenticationDTO:AuthenticationDTO = new AuthenticationDTO();
    const userDTO:UserDTO = new UserDTO();
    userDTO.id = user.id;
    userDTO.username = user.username;
    userDTO.email = user.email;
    userDTO.age = user.age;

    authenticationDTO.user = userDTO;
    authenticationDTO.token = await JWT.generateToken(user);

    //implement token generation and refresh token

    resp.json({authenticationDTO});

    } catch (error) {
        resp.status(500).json({
            message: error.message,
        });
    }

});

//getting all users
app.get("/users", async function(req: Request, res: Response) {
    const users = await Database.userRepository.find();
    res.json(users);
});

//getting user by id
app.get("/user/:id", async (req: Request, resp: Response ) =>{
    const user = await Database.userRepository.findOne(req.params.id);
    return resp.send({"user": user});
});

//updating user
app.put("/user/:id", async function(req: Request, res: Response) {
    const user = await Database.userRepository.findOne(req.params.id);
    Database.userRepository.merge(user, req.body);
    const results = await Database.userRepository.save(user);
    return res.send(results);
});

//deleting user
app.delete("/user/:id", async function(req: Request, res: Response) {
    const results = await Database.userRepository.delete(req.params.id);
    return res.send(results);
});


app.listen(4000, () => console.log('express on port 4000!'));

createConnection().then(async connection => {


}).catch(error => console.log(error));
