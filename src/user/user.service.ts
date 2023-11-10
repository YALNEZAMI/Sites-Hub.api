import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SiteService } from 'src/site/site.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly siteService: SiteService,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    //lower case email
    createUserDto.email = createUserDto.email.toLowerCase();
    //all fileds are required case
    if (
      createUserDto.name == null ||
      createUserDto.name == '' ||
      createUserDto.email == null ||
      createUserDto.email == '' ||
      createUserDto.password == null ||
      createUserDto.password == '' ||
      createUserDto.password2 == null ||
      createUserDto.password2 == ''
    ) {
      return {
        status: 400,
        message: 'All fields are required',
      };
    }
    //password dont match case
    if (createUserDto.password != createUserDto.password2) {
      return {
        status: 400,
        message: 'Passwords do not match',
      };
    }
    //password so short case
    if (createUserDto.password.length < 6) {
      return {
        status: 400,
        message: 'Passwords so short',
      };
    }
    //email already exists case
    const exists = await this.existsByMail(createUserDto.email);
    if (exists) {
      return {
        status: 400,
        message: 'Email already exists',
      };
    }
    try {
      //set deflaut image
      createUserDto.image = process.env.DEFAULT_PROFILE_IMAGE;
      //crypt password
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const creation = await this.userModel.create(createUserDto);
      const user = await this.findConfidentialUser(creation._id.toString());
      const response = {
        status: 200,
        message: 'Account created successfully',
        user: user,
      };
      return response;
    } catch (error) {
      console.log(error);

      return {
        status: 500,
        message: 'Server error please try again later',
      };
    }
  }

  findAll() {
    return this.userModel.find().exec();
  }
  findConfidentialUser(id: string) {
    return this.userModel
      .findOne({ _id: id }, { password: 0, password2: 0 })
      .exec();
  }
  async existsByMail(email: string) {
    const res = await this.userModel.findOne({ email: email });

    if (res == null) {
      return false;
    } else {
      return true;
    }
  }
  async login(user: { email: string; password: string }) {
    //lower case email
    user.email = user.email.toLowerCase();
    //all fileds are required case
    if (
      user.email == null ||
      user.email == '' ||
      user.password == null ||
      user.password == ''
    ) {
      return {
        status: 400,
        message: 'Fill all required fileds, please !',
      };
    }
    //email doesn't exists case
    const exists = await this.existsByMail(user.email);

    if (!exists) {
      return {
        status: 400,
        message: 'Email does not exists',
      };
    }
    const userFound = await this.userModel.findOne({ email: user.email });
    const rightPassword: boolean = await bcrypt.compare(
      user.password,
      userFound.password,
    );
    //password is wrong case

    if (!rightPassword) {
      return {
        status: 400,
        message: 'Password is wrong',
      };
    }
    //login success case
    const userRes = await this.findConfidentialUser(userFound._id.toString());
    //set apps
    userRes.apps = await this.siteService.findAppsOfUser(userFound._id);
    return {
      status: 200,
      message: 'Login success',
      user: userRes,
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const password = updateUserDto.password;
    const password2 = updateUserDto.password2;

    if (password != undefined) {
      //password so short case

      if (password.length < 6) {
        return {
          status: 400,
          message: 'Passwords so short',
        };
      }
      //password dont match case

      if (password != password2) {
        return {
          status: 400,
          message: 'Passwords do not match',
        };
      }

      //crypt password
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    //lower case email
    updateUserDto.email = updateUserDto.email.toLowerCase();
    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();
    const user = await this.findConfidentialUser(id);
    return {
      status: 200,
      message: 'User updated successfully',
      user: user,
    };
  }

  async remove(id: string): Promise<any> {
    try {
      await this.userModel.deleteOne({ _id: id }).exec();
      await this.siteService.deleteAllOfUser(id);
      return {
        status: 200,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Server error please try again later',
      };
    }
  }
}
