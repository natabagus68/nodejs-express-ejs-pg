const fs = require("fs");
const pool = require("./connection");
const { Chef, RecipeDetail } = require("../models/class");

fs.readFile("../data/chefs.json", "utf-8", (err, res) => {
  if (err) console.log(err);
  else {
    const chefs = JSON.parse(res)
      .map((e) => {
        return new Chef(null, e.fullName, e.birthDate, e.gender, e.city);
      })
      .map((e) => {
        return `('${e.fullName}', '${e.birthDate}', '${e.gender}', '${e.city}')`;
      })
      .join(",\n");

    const queryChefs = `
      insert into "Chefs" ("fullName", "birthDate", gender, city)
      values
      ${chefs}
      `;

    pool.query(queryChefs, (err, res) => {
      if (err) console.error(err);
      else {
        console.log("Seeding Chefs table is success");
        fs.readFile("../data/recipes.json", "utf-8", (err, recipesData) => {
          if (err) console.log(err);
          else {
            const recipes = JSON.parse(recipesData)
              .map((e) => {
                return new RecipeDetail(
                  null,
                  e.name,
                  e.duration,
                  e.category,
                  e.totalVote,
                  e.createdDate,
                  e.notes,
                  e.imageUrl,
                  e.ChefId
                );
              })
              .map((e) => {
                return `('${e.name}', ${e.duration}, '${e.category}', '${e.createdDate}', '${e.notes}', '${e.imageUrl}', ${e.totalVote}, ${e.ChefId})`;
              })
              .join(",\n");

            const queryRecipes = `
              insert into "Recipes" (name, duration, category, "createdDate", notes, "imageUrl", "totalVote", "ChefId")
              values
              ${recipes}
              `;
            pool.query(queryRecipes, (err, res) => {
              if (err) console.error(err);
              else console.log("Seeding table Recipes is success");
            });
          }
        });
      }
    });
  }
});
