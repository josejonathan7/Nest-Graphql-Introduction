import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeleteResult } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
	constructor(
		private userService: UserService
	){}

	@Query(() => [User])
	async users(): Promise<User[]> {
		const user = await this.userService.findAll();

		return user;
	}

	@Query(() => User)
	async user(
		@Args('id') id: string
	): Promise<User> {
		const user = await this.userService.findOne(id);

		return user;
	}

	@Mutation(() => User)
	async createUser(
		@Args('data')
		data: CreateUserInput
	): Promise<User> {
		const user = await this.userService.createUser(data);

		return user;
	}

	@Mutation(() => Boolean)
	async deleteUser(
		@Args('id')
		id: string
	): Promise<boolean> {
		const deleted = await this.userService.deleteUser(id);

		return deleted;
	}

	@Mutation(() => User)
	async updateUser(
		@Args('id')
		id: string,
		@Args('data')
		data: UpdateUserInput
	): Promise<User>
	{
		const user = await this.userService.updateUser(id, data);

		return user;
	}

}
