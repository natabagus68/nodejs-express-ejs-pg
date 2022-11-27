const pool = require("../setupDB/connection");
const { Chef, ChefDetailDuration } = require("./class");
class ChefModel {
  static getChefs(cb) {
    const queryGetData = `
        select * from "Chefs" order by "fullName" asc;
    `;
    pool.query(queryGetData, (err, res) => {
      if (err) cb(err);
      else {
        const result = res.rows
          .map((e) => {
            return new Chef(e.id, e.fullName, e.birthDate, e.gender, e.city);
          })
          .map((e) => {
            // delete e.id;
            e.birthDate = e.birthDates;
            return e;
          });
        // console.log(result);

        cb(null, result);
      }
    });
  }

  static getDetail(cb) {
    const queryDetail = `
    select c."fullName", c."birthDate", c.gender, c.city  ,avg(r.duration), max(r.duration), min(r.duration) from "Chefs" c
    inner join "Recipes" r on c.id = r."ChefId"
    group by c."fullName", c."birthDate" , c.gender, c.city  ;
    `;

    pool.query(queryDetail, (err, res) => {
      if (err) cb(err);
      else {
        let data = res.rows
          .map((e) => {
            return new ChefDetailDuration(
              null,
              e.fullName,
              e.birthDate,
              e.gender,
              e.city,
              e.avg,
              e.min,
              e.max
            );
          })
          .map((e) => {
            e.birthDate = e.birthDates;
            return e;
          });
        cb(null, data);
      }
    });
  }
}

module.exports = ChefModel;
