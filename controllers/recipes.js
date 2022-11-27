const ModelRecipes = require("../models/recipeModel");
const url = require("node:url");

class Recipes {
  static toRecipesList(req, res) {
    const search = req.query.search;

    ModelRecipes.getAllRecipes(search, (err, data) => {
      if (err) res.send(err);
      else res.render("recipes/list/list", { data });
    });
  }

  static readMore(req, res) {
    const id = req.params.id;
    ModelRecipes.getDetailPerRecipe(id, (err, data) => {
      if (err) res.send(err);
      else res.render("recipes/detail/detail", { data });
    });
  }

  static toAdd(req, res) {
    let massage = req.query;
    ModelRecipes.toAdd((err, data) => {
      if (err) res.send(err);
      else res.render("recipes/add_update/add", { data, msg: massage });
    });
  }

  static addRecipe(req, res) {
    const body = req.body;
    ModelRecipes.addRecipe(body, (err, data, val) => {
      if (err) res.send(err);
      else if (val) {
        res.redirect(
          url.format({
            pathname: "/recipes/add",
            query: val,
          })
        );
      } else res.redirect("/recipes");
    });
  }

  static toFormEdit(req, res) {
    let id = req.params.id;
    let massage = req.query;
    ModelRecipes.getRecipesById(id, (err, recipe, chefs) => {
      if (err) res.send(err);
      else
        res.render("recipes/add_update/update", {
          recipe,
          chefs,
          msg: massage,
        });
    });
  }

  static update(req, res) {
    let id = req.params.id;
    let body = req.body;
    ModelRecipes.updateRecipe(id, body, (err, data, val) => {
      if (err) res.send(err);
      else if (val) {
        res.redirect(
          url.format({
            pathname: `/recipes/${id}/edit`,
            query: val,
          })
        );
      } else res.redirect("/recipes");
    });
  }

  static deleteRecipe(req, res) {
    let id = req.params.id;
    ModelRecipes.deleteRecipe(id, (err, data) => {
      if (err) res.send(err);
      else res.redirect("/recipes");
    });
  }

  static vote(req, res) {
    let id = req.params.id;
    let v = req.query.totalVote;
    // console.log(vote);
    ModelRecipes.vote(id, v, (err, data) => {
      if (err) res.send(err);
      else res.redirect(`/recipes/${id}`);
    });
  }
}

module.exports = Recipes;
