import { FilmRating } from "types";

export const getRatingFromVueLink = (link: string): FilmRating => {
  switch (link) {
    case "https://www.myvue.com/-/media/vuecinemas/certificates/uk/u.png?rev=e97cd4a254c444e3a88f33f305ef7b96&sc_lang=en":
      return "U";

    case "https://www.myvue.com/-/media/vuecinemas/certificates/uk/pg.png?rev=f0e6fa9f2e234b94b30a50ccbd747bba&sc_lang=en":
      return "PG";

    case "https://www.myvue.com/-/media/vuecinemas/certificates/uk/12a.png?rev=b91ed3a02335433fb5f5becf370850dc&sc_lang=en":
      return "12A";

    // ToDo: Add case for the 12 rating once you have the correct link
    case "linkTo12Image":
      return "12";

    case "https://www.myvue.com/-/media/vuecinemas/certificates/uk/15.png?rev=598f12f81bdb4555be5c6f79c43b1ac0":
      return "15";

    case "https://www.myvue.com/-/media/vuecinemas/certificates/uk/18.png?rev=584957d8a2b14debad8a2db854b1cfc8&sc_lang=en":
      return "18";

    case "https://www.myvue.com/-/media/vuecinemas/certificates/uk/u.png?rev=e97cd4a254c444e3a88f33f305ef7b96&sc_lang=en":
      return "TBC";

    default:
      return "N/A";
  }
};

export const buildDateObjectFromVueElements = (
  day: string,
  timeOfDay: string
): Date => {
  const datePart = day.match(/\d{4}-\d{2}-\d{2}/)[0];
  return new Date(`${datePart} ${timeOfDay}`);
};
