import { EUserRole } from '../enums/role.enum';

export interface LoggedInterface {
  id: number;
  email: string;
  role: EUserRole;
}
