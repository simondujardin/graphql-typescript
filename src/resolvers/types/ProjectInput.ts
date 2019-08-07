import { Field, Int, InputType } from "type-graphql";

@InputType()
export class ProjectCreateInput {
  @Field()
  name: string;
}

@InputType()
export class ProjectUpdateInput {
  @Field()
  name: string;
}