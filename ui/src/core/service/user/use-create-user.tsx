import { useMutation } from '@tanstack/react-query';
import { UserService } from './user.service';
import { CreateUserRequest } from '@/core/models/create-user.interface';

export const useCreateUser = () => {
  const userService = new UserService();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data)
  });
};
