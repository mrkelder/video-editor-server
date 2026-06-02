export class CreateUserDto {
  readonly userName: string;
  readonly password: string;
  readonly inviteCode: string;

  constructor(userName: string, password: string, inviteCode: string) {
    this.userName = userName;
    this.password = password;
    this.inviteCode = inviteCode;
  }
}
