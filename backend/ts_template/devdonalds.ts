import express, { Request, Response } from "express";
//import {body, validationResult} from "express-validator";

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

interface compiledRecipe extends cookbookEntry {
  cookTime: number;
  ingredients: requiredItem[];
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!

const cookbook: (recipe | ingredient)[] = [
  {
    type: "recipe",
    name: "Skibidi Spaghetti",
    requiredItems: [
      {
        name: "Meatball",
        quantity: 3,
      },
      {
        name: "Pasta",
        quantity: 1,
      },
      {
        name: "Tomato",
        quantity: 2,
      },
    ],
  },
  {
    type: "recipe",
    name: "Meatball",
    requiredItems: [
      {
        name: "Beef",
        quantity: 2,
      },
      {
        name: "Egg",
        quantity: 1,
      },
    ],
  },
  {
    type: "recipe",
    name: "Pasta",
    requiredItems: [
      {
        name: "Flour",
        quantity: 3,
      },
      {
        name: "Egg",
        quantity: 1,
      },
    ],
  },
  {
    type: "ingredient",
    name: "Beef",
    cookTime: 5,
  },
  {
    type: "ingredient",
    name: "Egg",
    cookTime: 3,
  },
  {
    type: "ingredient",
    name: "Flour",
    cookTime: 0,
  },
  {
    type: "ingredient",
    name: "Tomato",
    cookTime: 2,
  },
];


// Task 1 helper (don't touch)
app.post("/parse", (req: Request, res: Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input);
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
  recipeName = recipeName.replace(/[-_]/g, " ");
  const words: string[] = recipeName.split(" ");
  const finalRecipe: string[] = [];
  words.forEach((element) => {
    element = element.replace(/[^ a-z A-Z \s]/g, "");

    if (element) {
      element =
        element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      finalRecipe.push(element);
    }
  });
  recipeName = finalRecipe.join(" ");

  if (!recipeName) {
    return null;
  }

  return recipeName;
};

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req: Request, res: Response) => {
  // TODO: implement me
  const { body } = req;
  const newEntry: recipe | ingredient = { ...body };
  console.log(body);
  for (let i = 0; i < cookbook.length; i++) {
    if (body.name == cookbook[i].name) {
      return res.status(400).end();
    }
  }
  if (newEntry.type == "ingredient") {
    if (newEntry.cookTime < 0) {
      return res.status(400).end();
    }
  } else if (newEntry.type == "recipe") {
    const found = new Set();
    for (let x = 0; x < newEntry.requiredItems.length; x++) {
      if (found.has(newEntry.requiredItems[x].name)) {
        return res.status(400).end();
      }
      found.add(newEntry.requiredItems[x].name);
    }
  } else {
      console.log("trip or nah");
      return res.status(400).end();
  }
  cookbook.push(newEntry);
  return res.status(200).end();
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req: Request, res: Response) => {
  // TODO: implement me
  const { query } = req;

  const selectedRecipe = (() => {
    for (let x = 0; x < cookbook.length; x++) {
      if (cookbook[x].name == query.name) {
        return cookbook[x];
      }
    }
    return res.status(404).end();
  })();
  

  const ingridientPosition = (x) => {
    for (let i = 0; i < cookbook.length; i++) {
      if (cookbook[i].name == x.name) {
        return i;
      }
    }
    // error case: no such item exists
    return res.status(400).end();
  };
  
  // type script narrowing  
  if (!selectedRecipe || selectedRecipe.type !== "recipe") {
    return res.status(400).end();
  }
    
  const quantityMultiples: number[] = []
  for(let u = 0; u < selectedRecipe.requiredItems.length; u++) {
    quantityMultiples.push(selectedRecipe.requiredItems[u].quantity);
  }


  const ingridientPositions: number[] = selectedRecipe.requiredItems.map(ingridientPosition);
  
  const summary: compiledRecipe = {
    name: selectedRecipe.name,
    cookTime: 0,
    ingredients: []

  }
 
  
  const recipes: number[] = []
  const recipesToIndex: Record<number, number> = {};

  for(let j = 0; j < ingridientPositions.length; j++) {
    
    if(cookbook[ingridientPositions[j]].type === "ingredient") {
      summary.ingredients.push({name: cookbook[ingridientPositions[j]].name, 
                                  quantity: selectedRecipe.requiredItems[j].quantity})
      //summary.cookTime += (cookbook[ingridientPositions[j]].cookTime * selectedRecipe.requiredItems[j].quantity)
      console.log(cookbook[ingridientPositions[j]])
      console.log(selectedRecipe.requiredItems[j].quantity)
      console.log(selectedRecipe.requiredItems[j])
    }else {
      recipes.push(ingridientPositions[j])
      recipesToIndex[ingridientPositions[j]] = j
     }
  }
 

 for(let k = 0; k < recipes.length; k++) {
    
    
    const currentRecipe = cookbook[recipes[k]];
    const multiplier = quantityMultiples[recipesToIndex[recipes[k]]]

    if ("requiredItems" in currentRecipe) {
      for(let p = 0; p < currentRecipe.requiredItems.length; p++) {
    
        if (summary.ingredients.some(recipeName => recipeName.name ===  currentRecipe.requiredItems[p].name)) {
          //summary.requiredItems.push({name: currentRecipe.requiredItems[p].name, quantity: currentRecipe.requiredItems[p].quantity});
          const index = summary.ingredients.findIndex(item => item.name === currentRecipe.requiredItems[p].name);
          if (index !== -1) {
            summary.ingredients[index].quantity += (currentRecipe.requiredItems[p].quantity * multiplier) //* selectedRecipe.requiredItems[k]);

          }
        }else {
          summary.ingredients.push({name: currentRecipe.requiredItems[p].name, quantity: currentRecipe.requiredItems[p].quantity * multiplier});
        }
      }
    }
  }
  
  console.log(summary)

  res.send("Hello World!");
});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================

const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
