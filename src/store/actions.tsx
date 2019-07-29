import { ActionType } from "typesafe-actions";
import * as malariaActions from "../malaria/actions";

export enum ActionTypeEnum {
  MalariaSetTitle = "malaria/SET_TITLE"
}

export type MalariaAction = ActionType<typeof malariaActions>;
