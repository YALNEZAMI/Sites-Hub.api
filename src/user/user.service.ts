/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SiteService } from 'src/site/site.service';
import { CreateSiteDto } from 'src/site/dto/create-site.dto';
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
      //adding some default sites
      const ENT: CreateSiteDto = {
        user: creation._id,
        name: 'ENT',
        image:
          'data:image/png;base64,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',
        description: 'My university website',
        category: 'Studies',
        addDate: new Date(),
        url: 'https://ent.univ-rennes1.fr/f/bureau/normal/render.uP',
      };
      const MessageIt: CreateSiteDto = {
        user: creation._id,
        name: 'Message-It',
        image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEUac+j///8AbecAaefW4fkAbOcUceiWufPY5voAaOcMb+f7/f/0+f7h7fz1+v7x9/5hmu4edei81fjr8/0ygOqXvfRSk+3e6/yGsvLL3/qsyPbn8f1GjOw0gupxpfAieum0z/dmn++ixPVNkO3K2vh8rPF0p/CMtvNAiOuwzfdrou+71Pc8geqWvPOBr/G3zvbz8GvgAAAN4klEQVR4nN2d6baiOhBGQ5CIwQlEFBA5zhy9nn7/t7sBHABBKxCN+v3otbptIdtMlaSqghSBMroDf+JaP96yPd3uh46zmkVBYNthLDOv+J9sOwiiaLZyhov5Zjde/lqu3hsNDJFlUpCQpwx8fe21NwsnskMT0bMIE0LpnyW6fkxJ/N8xJSi0g9lwPh3/uL1RX0jZmhJ2fXf5t5jZMReOmVAFDkzx99MfxwwDZ7770f2mnA0IuxPruIjCc2014CplTVFJ4GyXbq8BZj1Cw7fGi8hM2tVzxVowe0m42izd0csIu257aKOkRb5IJO7aZrT1ejUGIV7CkTWNXkp3xWStNhyOdV5ILsLuemtjGXQXUUxmRz5IOKHh/kUIS6RLxWrSdJa+eMLuz9CUWntZUWpvdLGEAy+iTx82eUSouXfFEY7GAaaymW6EydCCdMjHhH1Wf+9UfRfF9dgSQLh26PvV30mEhn8Px5wHhP4UvWcFnoWDnwdN9S6h8RPInx4eiNL9pDZhf/q+DfQqQoN1TULdee8GehE1x3daajXhIcSyiw4WHlYvPCoJPfMDWuhFeNXjJVyiz2ihZ+GoyowrJzSmn8XHRIMKK66ccKd9HCGiYXktlhJ+WhNNRaPSvlhG6Mkua03RVZkJV0JomZ9Yg7HosAsh7NmfNE3khf8AhMbwcwGZBffzmHD3wYAM8XZALRJassvYUHg4uE84mH10FTLR8X3C4+dY2xUi4eQeoWvKLmBz0f0dQmPx8VUY7/5b1YSHj7TWiqKrQRXhwPn0YSYV9aoIva+oQkY4G5UTGh8/U5xFl+WE1rcAsko0Sgk/2SAtCB/KCN2PXTTdig7LCLdfMBeeRUz3lrBnf08Vsma6uSVcfk8vZCKBXyQ0vmS2P4v+Fgn1L7C5s7ra32fC8XdVIVtE+XlCY/VlhNdmeiLUv8QkvYou8oTLL5oMTwoHOcIvstjOOltuKaH/VdN9KvqXJTx8XxWyBUY/Q/jZ28AVOm26JYTdLzNoUp3mC/R9VvdZdHoltN7FrVKo6Kp7Ifw2ky0VsXsXwi+cDWORw5nQiL6xkZ633GLCyRft0GSVrqBiwu/ZRsyLRMaJUOiRGqEUa2o9aVioNzkx/RPhQlQdUqxqtrNte9a6xa/1wWvPHVtVhTmVUzclFDTQULWzaluNQ+r6o3V71VGFQGpeStgLmz+LamR4EBcZ2T8siNYckm5SQrfx+p7i1T8x4ZAZyH9OY0bqGAnhb8OBhmp7cAALl/RtQ0ZidxPCdqPH0M62ZmAgQP6806hwZi8hnDd4CNGG9z3lm2q0auAIStA6Jmyy243Dw+NCNpRla7XLF593I2VQf7LozMUGlperu1VrEx5jwtrLX0qfX4GpDqRmM4uPoJCi15wOtYgjzLGh/KjeeE/3BiO06k2H6vAVLfSiYa2WSld9RvhbqwWo01fyMU3rIJJgwAhrHY2q7RcDsmm7BiKxfUZYZ69UAmA9xFBnhFt+QnUnAVBRdtyIsccCqjHha/vHpXmK5txzP/lRUJ/7bJQ6kgAVZcU7aTCjBnV5TRoSFj2pX6cu754ZXSpoEHB+qQOIn36aXM6uiNsKGnEabepRIiD3gEp3CtL5Kp6upAIqCp+LKN0riG8Pg+DnLOfh0rmiy6ljIIurCrWSwKIX649nymCGKeI74DZfam6Xi6fAJOoiLsNb9R4X4OnyOAYbZnojj2MSJfYbVKFi/AfvWMQeIR5fobeoQr5KDEeI41iGhKK3feupG8IrMfTRBt4PsYw1U5l24FohZgtx7JZqr9uYuS8fPGEQNt/vwYQS1xRFgddDBK0R3EtB+3386hfpF16JFgehKm/VVFQXPJrSAwIv8aXb3FmBS01+0Ao68mrFAFuZWkKbKf2FE6qyVxVZ6dBmij00gxKGJRkZpGkAPYqgSwTdpnmjuSIWtCNiRgj9MTaPX/tCQU0xRhgACTWw1d3XW62qrE2+3tKrJp1JqwXv6h5wqMFjMKEKTDXpb0KqqiQoSzD2b2VqqmYOSx7Vb//HvobtKbC3t4BDDZyQUNh5/Th1LSBEu8nBMXBOfkC0sy/ir4mWePES3PkHes8E2kqPCLpdaoI8Ljad629S2FgdhNdCaU4e0cp+DTTv+sBINEYI3S4FrQ1/s22HhLkfJWct548+9OxHRLubJPCkPnC6wG0oIbEBrzXy39Gyw++/Tu6zTrYvDnPrPRoBXqUAy81B+B/grct89yc0U4lRvuNkY5H1PDzqQCoRuFmDd0IJi9OwenXW6BU3njMm0rgw8oOmXjmExd6f2fYoju7ZsXle2JSgMymEkH5YnKPw1Z3BKn6mXSeT4hIV9C5oPxRLePP4ax2u79VhgRBShwZ0LAUTIsi56E0/vOYW6xXDcjL9sLjYg/TDrnDC1Cv8gQpbtQQDx9JC/ULGUh94KAifLRDkWM3IvxZvM58V58Ps4wrzIaRD6MAtUw6bRoVMUh7YpplnP5rw2zTFfl1J2Abbpdry8WsV5a9zeRxReezS69dgdil0oya2vGH/M9/k7rxZPa8tzNu1Rad6bYG09N4grMJ2ZaF+ThyEoGmYqTcPsaqioGzBvJ6ZWkcznZL1odG22fqQ2n9Ap3HocT7HCpiY0A3hR2v8Kga2xp9AzycHUO8DRgjdpwEv8l8isF8Nhu+1ZU0w+WpDz9cYIXi/lICWbS8SuF7oEr7njTqVac9fLr/zuLipsIccMOEbHVyAjy3icwu4eyloefEawX3xyA/H+WF2SSdXLbhbFD0gjgBSCjNrni8O3wNicZzjs0n2PVwVRuASJ54KPI7s2nu4m+zgjTQmnPK4ToMtt2dqwJF4jZgTLq8vpMkJQ8hryuN+GfL5tbFZX35PHIFnexTPcHy+ifntFUniSlMSe1/+8IVbaNbjMjxVNxuv9wmjLuJMikEkOyz0+UILyKyP1pz5hfBCKiFnTvXYk507uW5Hphstj/NsLDI0EHfOCCLRPJ3whq7TDX/MzM0+6As14HAOPhHuasQ9sa44k+PQ3ucOXYtvu0D9GpnYsRw3RX7AJHatXyelgiZj4h/WyK1AfxVU724gbfXqhmo4NQAJOihImdaKVser1878Rp0aZINiixEe62VkoOFLt97q1CBK8l/WjMdHr0yLodTrgyhNXI4UTtM7o87mVZ2xJiAzvOOcCg3uRNAqL44UK/4o9ZPo0GiQ2yR5At28IBRqXj8/zTbO3jLiN2quIth8uiFeHzA22hhhF3w2Uy41+PfU7tgAEOFlkieqafZSotne8/bgmgAmGUyRomwaJ4Ykmjl/Uh6CTSPA+KoSJCjjPO2gv7X41toIMN5LTAhFpSunKnam/3ojgZwNAUnUTwhbwlLQkji9pxmsFptpG6JHm68NAdP7EVCdlfN9EUopBkjrPLAXmgKm5yxxhlZZGdnpfcLGgCixnGNCjmBnobpP2ByQIP1ECI2wEa27hM0BT7mCYkJXUtL5e4QCABFJwu1iwpGANLt1dIdQBODpDo8kJ7uki4KqCYUAnu6yTPLq10jZJqQEVYS1Mgje6HS9XEJYL3ViY1URigFkFs3oQijp6sMKQkGAzKLpXwgbLYIbFKGUUBTg+f7qhNDgcKoRqFJCYYBJmuQzoaTLD8sI2zx+CHdF7FGGUE5HLCGEOx0+fvopSW5KyJ08UUwZbgiXqrhynJ1FT/euSTG+bwiXwppoHNig5wgtGXfnFQmXogaZWOkFJVdCKaZpgVBkE8043p9v6dxLqMQ84W9HJCBBboGw/vlMfeUIPaGAiM66BUJfglmTJfQaXIFQ+uyLF+XlxmMJl1ZnCD2hfTB3bfWFUMLtcldCwU30cqtcjrBbw+ukoS6hlKJr8HwhWZ5QwgV65wttRffBNNv8LaGE21ZTp2rxNZiLQrsSKlw+7WKkmdN2JNKSSUXQpJRwIsWu4Up8DH1oNvQlQyhrQ0q8QreC0JW0bypaeGtUECp/31GJZu48Okc4+Ypbc3E+7CVHeJML5xMVe3pVEw5eb9iIFsEFd7s8oYCbAmULF1O/FAilnZaKEomKTqFFwt5n3w1MtBuX0CIhmxQ/GZHe3t1wQyjGgUiSaEmcxC2hpEMMEaJ2yTnBLaEyqhHX8BYiN+k2KwjZaPORtUhIaRqkMkJFDz4QkdDyW4xKCdmA+nGIpCq7TDmh4n5cQ6VVuQIqCJXJZ1moFFVetFVFqPScZ+wvPEnUrk7xVEmoDLbCN/meJIKDO/5j1YSK4n3GeEPo5p4j/T1CRZfkDsYjVoH3k5DdJVRGO/PNGSldPPA0vk/IqtHBb8xI8J0hBkiodL2IvumIQ2gwfhxW/pBQUfxj8I6MMD4QIZv+d7b2Xm01ztu/g2WSARGyyXE5o+/DSCgJjtC0B0BC1h9/hyZ9h9ZKCEULF57WAUzIFv+t4wrJhiSYRFOXJ/CIg5Cp6+4iyqYPKZSE/bw4mLuckYB8hEyGPh6G7F2vpYzpkDkcT/gDHbkJY8jeYerY7J2vabGEsFYT7v9c2C0pIghjDSbWcTELMWuzz3RTiUPE6Gw+dcH5d4URJupP1suNE8T9I65PUajsOSR5JA2H+2Nr0ixcvBFhIsPXrfFmsQpCM264sQg/bfKVE5dphrYz33q6LiIxRXPCk7r+xLW843S7cGaBHYZmUlycFLla+PwxYlRBNNxupu1lS5/0xIX5CyO8yOgPRv5Ed63Dj7cct3fTv812vt8vFovhRewvi/18y3h2x/HS+/2xGJQ/Ehlge9H/9cTwQ4/RT+oAAAAASUVORK5CYII=',
        description: 'My messaging website',
        category: 'Social',
        addDate: new Date(),
        url: 'https://message-it.onrender.com',
      };
      const Dactylo: CreateSiteDto = {
        user: creation._id,
        name: 'Dactylo',
        image:
          'data:image/jpeg;base64,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',
        description: 'My learning typing website',
        category: 'Hobbies',
        addDate: new Date(),
        url: 'https://dactylo.onrender.com',
      };
      await this.siteService.create(ENT);
      await this.siteService.create(MessageIt);
      await this.siteService.create(Dactylo);

      const user = await this.findConfidentialUser(creation._id.toString());
      //set apps
      user.apps = await this.siteService.findAppsOfUser(user._id);
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
