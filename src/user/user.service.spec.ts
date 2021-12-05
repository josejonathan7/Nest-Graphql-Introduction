import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUtil } from '../common/test/testUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: getRepositoryToken(User),
        useValue: mockRepository
      }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.delete.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findAllUserService', () => {
    test("->should get all users", async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.find.mockReturnValue([user,user]);
      const users = await service.findAll();

      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);

    })
  });

  describe("#findUserById", () => {
    test("->Should find a existing user", async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findOne('1');

      expect(userFound).toMatchObject({name: user.name});
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    test("->Should return a exception when does not find a user", async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findOne('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    
  });

  describe("#Create user", () => {
    test("->Should create a user", async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);

      const savedUser = await service.createUser(user);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(savedUser).toMatchObject(user);
    });

    test("->Should return a exception when doesn create a user", async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);

      await service.createUser(user).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema para criar um usuário!'
        });
      });

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);

    })
  });

  describe("#Updated user", () => {
    test("->Should update a user", async () => {
      const user = TestUtil.giveMeAValidUser();
      const updatedUser = {name: 'nome atualizado'};

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser
      });

      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser
      });

      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'nome atualizado'
      });

      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);

    });
  });

  describe("#Deleted user", () => {
    test("->Should delete a existing user", async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
      expect(deletedUser).toBe(true);
    });

    test("->Should not delete a inexisting user", async () => {
      const user = TestUtil.giveMeAValidUser();

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(null);

      const deletedUser = await service.deleteUser('9');

      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
      expect(deletedUser).toBe(false);
    });
  })
});
