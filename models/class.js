class Chef {
  constructor(id, fullName, birthDate, gender, city) {
    this.id = id;
    this.fullName = fullName;
    this.birthDate = birthDate;
    this.gender = gender;
    this.city = city;
  }

  get birthDates() {
    let d = new Date(this.birthDate);
    var day = d.getDay();
    let format = d.toLocaleDateString("id").split("/");
    const month = [
      "January",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "Septemper",
      "Oktober",
      "November",
      "Desember",
    ];
    month.forEach((e, i) => {
      if (i + 1 === +format[1]) {
        format[1] = e;
      }
    });

    switch (day) {
      case 1:
        format.unshift("Senin");
        break;
      case 2:
        format.unshift("Selasa");
        break;
      case 3:
        format.unshift("Rabu");
        break;
      case 4:
        format.unshift("Kamis");
        break;
      case 5:
        format.unshift("Jum'at");
        break;
      case 6:
        format.unshift("Sabtu");
        break;
      case 7:
        format.unshift("Minggu");
        break;
    }
    let dayName = format[0];
    let date = format.slice(1);
    return `${dayName}, ${date.join(" ")}`;
  }
}

class ChefDetailDuration extends Chef {
  constructor(
    id,
    fullName,
    birthDate,
    gender,
    city,
    averageDuration,
    minDuration,
    maxDuration
  ) {
    super(id, fullName, birthDate, gender, city);

    this.averageDuration = averageDuration;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
  }
}

class Recipe {
  constructor(id, name, duration, category, totalVote) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.category = category;
    this.totalVote = totalVote;
  }
}

class RecipeDetail extends Recipe {
  constructor(
    id,
    name,
    duration,
    category,
    totalVote,
    createdDate,
    notes,
    imageUrl,
    ChefId,
    ChefName
  ) {
    super(id, name, duration, category, totalVote);
    this.createdDate = createdDate;
    this.notes = notes;
    this.imageUrl = imageUrl;
    this.ChefId = ChefId;
    this.ChefName = ChefName;
  }

  get createdDates() {
    const d = new Date(this.createdDate);
    const format = d.toLocaleDateString("id").split("/");
    const month = [
      "January",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "Septemper",
      "Oktober",
      "November",
      "Desember",
    ];
    month.forEach((e, i) => {
      if (i + 1 === +format[1]) {
        format[1] = e;
      }
    });
    return format.join(" ");
  }

  get note() {
    const notes = this.notes.split("\n");
    return notes;
  }

  get createdDates() {
    let yourDate = new Date(this.createdDate);
    let time = yourDate.toISOString().split("T")[0];
    return time;
  }
}

module.exports = { Chef, Recipe, ChefDetailDuration, RecipeDetail };
