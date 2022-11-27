const { deleteRecipe } = require("../controllers/recipes");
const pool = require("../setupDB/connection");
const Chefs = require("./chefModel");
const { Recipe, ChefDetailDuration, RecipeDetail, Chef } = require("./class");
class ModelRecipes {
  static getAllRecipes(s, cb) {
    let queryRecipes = `
    select * from "Recipes" 
    
    `;
    if (s) queryRecipes += `where name ilike '%${s}%'`;

    queryRecipes += "order by name desc";

    pool.query(queryRecipes, (err, res) => {
      if (err) cb(err);
      else {
        const data = res.rows.map((e) => {
          return new Recipe(e.id, e.name, e.duration, e.category, e.totalVote);
        });

        cb(null, data);
      }
    });
  }

  static getDetailPerRecipe(id, cb) {
    const queryDetailRecipe = `
    select r.id, r.name, r.duration, r.category, r."totalVote", r."createdDate", r.notes, r."imageUrl", c."fullName"  from "Recipes" r
    inner join "Chefs" c on c.id = r."ChefId"
    where r.id = ${+id}
    `;

    pool.query(queryDetailRecipe, (err, res) => {
      if (err) cb(err);
      else {
        const data = res.rows
          .map((e) => {
            return new RecipeDetail(
              e.id,
              e.name,
              e.duration,
              e.category,
              e.totalVote,
              e.createdDate,
              e.notes,
              e.imageUrl,
              null,
              e.fullName
            );
          })
          .map((e) => {
            delete e.ChefId;
            e.createdDate = e.createdDates;
            e.notes = e.note;
            return e;
          });

        cb(null, data[0]);
      }
    });
  }

  static toAdd(cb) {
    let queryGetChefs = `select id, "fullName" from "Chefs"`;

    pool.query(queryGetChefs, (err, chefs) => {
      if (err) cb(err);
      else {
        const chefss = chefs.rows
          .map((e) => {
            return new Chef(e.id, e.fullName);
          })
          .map((e) => {
            delete e.birthDate;
            delete e.city;
            delete e.gender;
            return e;
          });

        cb(null, chefss);
      }
    });
  }

  static addRecipe(i, cb) {
    let validationMassage = {
      name: "",
      duration: "",
      category: "",
      createdDate: "",
      notes: "",
    };

    for (let e in i) {
      if (i[e] === "") validationMassage[e] = `${e} is required`;
    }

    if (i["duration"] < 60) {
      validationMassage["duration"] = "duration minimal 1 menit ";
    }
    if (i["name"].length > 100 && i["name"] !== "") {
      validationMassage["name"] = "Recipe name maximum character is 100.";
    }
    if (i["imageUrl"].length > 50) {
      validationMassage["imageUrl"] = "Image Url name maximum character is 50.";
    }
    if (i["notes"].length < 10) {
      validationMassage["notes"] = "Minimum word in notes is 10.";
    }

    let flag = false;

    for (let e in validationMassage) {
      if (validationMassage[e] !== "") flag = true;
    }
    if (flag) {
      cb(null, null, validationMassage);
    } else {
      const queryAddRecipe = `
      insert into "Recipes" (name, duration, category, "createdDate", notes, "imageUrl", "ChefId")
      values
      ('${i.name}', ${i.duration}, '${i.category}', '${i.createdDate}', '${i.notes}', '${i.imageUrl}', ${i.ChefId})
      `;
      pool.query(queryAddRecipe, (err, res) => {
        if (err) cb(err);
        else cb(null, res);
      });
    }
  }

  static getRecipesById(id, cb) {
    const queryGetData = `
      select * from "Recipes"
      where id = ${id}
    `;

    pool.query(queryGetData, (err, res) => {
      if (err) cb(err);
      else {
        const recipeById = res.rows
          .map((e) => {
            return new RecipeDetail(
              e.id,
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
            e.createdDate = e.createdDates;
            delete e.ChefName;
            return e;
          });

        Chefs.getChefs((err, chefs) => {
          if (err) cb(err);
          else {
            cb(null, recipeById[0], chefs);
          }
        });
      }
    });
  }

  static updateRecipe(id, b, cb) {
    let validationMassage = {
      name: "",
      duration: "",
      category: "",
      createdDate: "",
      notes: "",
    };

    for (let e in b) {
      if (b[e] === "") validationMassage[e] = `${e} is required`;
    }

    if (b["duration"] < 60) {
      validationMassage["duration"] = "duration minimal 1 menit ";
    }
    if (b["name"].length > 100 && b["name"] !== "") {
      validationMassage["name"] = "Recipe name maximum character is 100.";
    }
    if (b["imageUrl"].length > 50) {
      validationMassage["imageUrl"] = "Image Url name maximum character is 50.";
    }
    if (b["notes"].length < 10) {
      validationMassage["notes"] = "Minimum word in notes is 10.";
    }

    let flag = false;

    for (let e in validationMassage) {
      if (validationMassage[e] !== "") flag = true;
    }

    if (flag) {
      cb(null, null, validationMassage);
    } else {
      let queryUpdate = `
    update "Recipes"
    set name = '${b.name}',
        duration = ${b.duration},
        "createdDate" = '${b.createdDate}',
        notes = '${b.notes}',
        "imageUrl" = '${b.imageUrl}',
        "ChefId" = ${b.ChefId}
    where id = ${id};
    `;

      pool.query(queryUpdate, (err, res) => {
        if (err) cb(err);
        else cb(null, res);
      });
    }
  }

  static deleteRecipe(id, cb) {
    const queryDelete = `
      delete from "Recipes" where id = ${id}
    `;

    pool.query(queryDelete, (err, data) => {
      if (err) cb(err);
      else cb(null, data);
    });
  }

  static vote(id, vote, cb) {
    let queryVote = `update "Recipes"
    set "totalVote" = ${+vote + 1}
    where id = ${id}
    `;
    // console.log(queryVote);

    pool.query(queryVote, (err, res) => {
      if (err) cb(err);
      else cb(null, res);
    });
  }
}

module.exports = ModelRecipes;
