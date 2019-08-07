import "reflect-metadata";
import { connect, disconnect } from './utils/mongooseConnect'
import { suite as ProjectsTest } from './tests/projects';
import { suite as TasksTest } from './tests/tasks';

describe("Projects", () => {
  beforeAll(() => connect());
  afterAll(() => disconnect());

  describe('Projects', ProjectsTest);
  describe('Tasks', TasksTest);
});
