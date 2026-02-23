import express, { Request, Response } from "express";
import {query} from "express-validator";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry { 
  name: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  type: "recipe";
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  type: "ingredient";
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!

const cookbook: (recipe | ingredient)[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  // TODO: implement me
  recipeName = recipeName.replace(/[-_]/g, " ")
  const words: string[] = recipeName.split(" ");
  const finalRecipe: string[] = [];
  words.forEach((element) => {
    element = element.replace(/[^ a-z A-Z \s]/g, "");

    if(element) {
        element = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
        finalRecipe.push(element);
    }
  }) 
  recipeName = finalRecipe.join(" ");

  if(!recipeName) {
    return null;
  }
 
  return recipeName
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  // TODO: implement me
  const newEntry:(recipe | ingredient) = {...req};
  console.log(newEntry);
  cookbook.push(newEntry);
  res.status(200).json({})

});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // TODO: implement me
  res.send("Hello World!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================

const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
