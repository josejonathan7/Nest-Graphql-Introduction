import { User } from "../..//user/user.entity";

export class TestUtil {

    static giveMeAValidUser(): User {
        const user = new User();

        user.email= "jonathan@gmail.com";
        user.id = "3";
        user.name = 'josé';

        return user;
    }

}