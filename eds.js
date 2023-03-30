const fillEdsVidGovD2Form = (data) => {
  // constant of your income address
  const BROKER = 'Interactive Brokers';
  const TYPE = 11;

  // function for convert your date from 2022-12-30 to 30.12.2022
  const convertDate = (date) => (date.trim().split('-').reverse().join('.'));

  // function for convert your price from 5.40 to 5,40
  const convertPrice = (price) => price.toString().trim().replace('.', ',');

  // function for change each form field
  const changeField = (elementClass, i, value) => {
    const eventChange = new Event('change');

    const element = document.querySelectorAll(elementClass)[i];

    element.value = value;
    element.classList.remove('invalid');
    element.dispatchEvent(eventChange);
  }

  return data.map((itemData, index) => {
    let [country, date, currency, name, divPrice, taxPrice, rate] = itemData.split(';');

    changeField('select.id_Valsts', index, country.trim());
    changeField('input.id_IzmaksNosaukums', index, name.trim());
    changeField('input.id_IzmaksAdrese', index, BROKER);
    changeField('select.id_IenakVeids', index, TYPE);
    changeField('input.id_IzmaksDatums', index, convertDate(date));
    changeField('select.id_IenValuta', index, currency.trim());
    changeField('select.id_NodValuta', index, currency.trim());

    let div = divPrice;
    let tax = taxPrice;

    if (rate) {
      div = divPrice * rate;
      tax = taxPrice * rate;

      changeField('input.id_SummaVal', index, convertPrice(divPrice));
      changeField('input.id_NodoklisVal', index, convertPrice(taxPrice));
    }

    changeField('input.id_Ienakums', index, convertPrice(div));
    changeField('input.id_NodLv', index, convertPrice(tax));
  });
}


