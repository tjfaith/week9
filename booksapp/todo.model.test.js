const mongoose = require("mongoose");
const { connectDB, dropDB, dropCollections } = require("./setupdb");
const Todo = require("./todo.model");

beforeAll(async () => {
    await connectDB();
  });
   
  afterAll(async () => {
    await dropDB();
  });
   
  afterEach(async () => {
    await dropCollections();
  });


  describe("Todo Model", () => {
    it("should create a todo item successfully", async () => {
      let validTodo = {
        item: "Do the dishes",
        completed: false,
      };
      const newTodo = await Todo(validTodo);
      await newTodo.save();
      expect(newTodo._id).toBeDefined();
      expect(newTodo.item).toBe(validTodo.item);
      expect(newTodo.completed).toBe(validTodo.completed);
    });
  });

  it("should fail for todo item without required fields", async () => {
    let invalidTodo = {
      item: "Do the dishes",
    };
    try {
      const newTodo = new Todo(invalidTodo);
      await newTodo.save();
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.completed).toBeDefined();
    }
  });