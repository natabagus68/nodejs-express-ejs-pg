const pool = require("./connection");

const dropTable = `
    drop table if exists "Chefs", "Recipes";
`;

const createChefs = `
    create table if not exists "Chefs" (
        id serial primary key,
        "fullName" varchar(120) not null, 
        "birthDate" date not null,
        gender varchar(6) not null,
        city varchar(20) not null
    )
`;

const createRecipes = `
        create table if not exists "Recipes" (
            id serial primary key,
            name varchar(100) not null,
            duration int not null,
            category varchar(10) not null,
            "createdDate" date not null, 
            notes text,
            "imageUrl" varchar(50) not null,
            "totalVote" int default 0,
            "ChefId" int not null,
                foreign key ("ChefId") references "Chefs" (id)
        )
`;

pool.query(dropTable, (err, res) => {
  if (err) console.log(err);
  else {
    console.log("drop all table");
    pool.query(createChefs, (err, res) => {
      if (err) console.log(err);
      else {
        console.log("create table Chefs");
        pool.query(createRecipes, (err, res) => {
          if (err) console.log(err);
          else console.log("create table Recipes");
        });
      }
    });
  }
});
