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

const attendsOptions = Object.entries(attendsList).flatMap(([year, months]) =>
  Object.entries(months).flatMap(([month, values]) =>
    values.map((value) => ({
      value: `${month}${year.slice(-2)}-${value}`,
      label: `${month}${year.slice(-2)}-${value}`,
    }))
  )
);

const modalityList = ["Asincronico", "Sincronico"];
const modalityOptions = modalityList.map((attend) => ({
  value: attend,
  label: attend,
}));

const cuentasUnicas = ["MP Instituto", "Bco Sonia", "MP Facu", "MP Sonia", "Bco Facu", "Dani"];
const accountsOptions = cuentasUnicas.map((attend) => ({
  value: attend,
  label: attend,
}));

export default {attendsOptions, accountsOptions, modalityOptions};
