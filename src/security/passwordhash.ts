import * as bcrypt from 'bcrypt'
//returns hashed password
export class PasswordHash {
    public static async hashPasword(plainPassword: string){
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        
        return hashedPassword;
    }
}