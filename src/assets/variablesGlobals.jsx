const attendsList = {
  2023: {
    Mar: ["N1", "N2", "N3", "N4", "N5", "N6"],
    Ago: ["N1", "N2", "N3", "N4", "N5", "N6"],
  },
  2022: {
    Mar: ["N1", "N2", "N3", "N4", "N5", "N6"],
    Ago: ["N1", "N2", "N3", "N4", "N5", "N6"],
  },
  2021: {
    Mar: ["N1", "N2", "N3", "N4", "N5", "N6"],
    Ago: ["N1", "N2", "N3", "N4", "N5", "N6"],
  },
  2020: {
    Mar: ["N1", "N2", "N3", "N4", "N5", "N6"],
    Ago: ["N1", "N2", "N3", "N4", "N5", "N6"],
  },
  2019: {
    Mar: ["N1", "N2", "N3", "N4", "N5", "N6"],
    Ago: ["N1", "N2", "N3", "N4", "N5", "N6"],
  },
};

export const attendsOptions = Object.entries(attendsList).flatMap(([year, months]) =>
  Object.entries(months).flatMap(([month, values]) =>
    values.map((value) => ({
      value: `${month}${year.slice(-2)}-${value}`,
      label: `${month}${year.slice(-2)}-${value}`,
    }))
  )
);

const modalityList = ["Asincronico", "Sincronico"];
export const modalityOptions = modalityList.map((attend) => ({
  value: attend,
  label: attend,
}));

const cuentasUnicas = ["MP Instituto", "Bco Sonia", "MP Facu", "MP Sonia", "Bco Facu", "Dani"];
export const accountsOptions = cuentasUnicas.map((attend) => ({
  value: attend,
  label: attend,
}));

export function transformDateFormat(inputDate) {
  const dateParts = inputDate.split("/");

  const year = "20" + dateParts[2];

  const month = Number(dateParts[1]);
  const day = Number(dateParts[0]);

  if (!isNaN(month) && !isNaN(day)) {
    const paddedMonth = month < 10 ? "0" + month : month.toString();
    const paddedDay = day < 10 ? "0" + day : day.toString();

    return `${year}-${paddedMonth}-${paddedDay}`;
  }
}
