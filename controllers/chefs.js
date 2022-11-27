const ChefModel = require("../models/chefModel");
class Chef {
  static toListChefs(req, res) {
    ChefModel.getChefs((err, data) => {
      if (err) res.send(err);
      else res.render("chefs/list/list", { data });
    });
  }

  static toDetail(req, res) {
    ChefModel.getDetail((err, data) => {
      if (err) res.send(err);
      else res.render("chefs/detail/detail", { data });
    });
  }
}

module.exports = Chef;
