This is a simple code for filling dividends income (D2 Form) into https://eds.vid.gov.lv/ system.

Instruction:
0 First of all you need correct format data with your income dividends

  0.1 The format for income dividends from the EU should be
    `'Country of income; Date of receipt of income; Currency; Name of the paying agent; Foreign income Amount in LV currency; Tax paid in foreign state Amount in LV currency'`
    looks tricky but don't worry let's explain everything
    each field is split by the ';' symbol and it meant we have only 6 fields:
      Country of income;
      Date of receipt of income;
      Currency;
      Name of the paying agent;
      Foreign income Amount in LV currency;
      Tax paid in foreign state Amount in LV currency
    example:
    `'DE; 2022-05-09; EUR; BMW; 10.0; 2.0'`
    It's only one position, but u need N positions so that means you need to put everything in a list of positions (array).

    example of an array:
    `const data = [
      'DE; 2022-05-09; EUR; BMW; 10.0; 2.0',
      'DE; 2022-05-09; EUR; BMW1; 11.0; 2.1',
      'DE; 2022-05-09; EUR; BMW2; 11.0; 2.1',
    ]`

  0.2 If you have income dividends from abroad of the EU you should convert the currency to EUR this means you need to have a rate, for example, USD to EUR (at the moment than dividends income).
    The format of income dividends from abroad should be
    `'Country of income; Date of receipt of income; Currency; Name of the paying agent; Foreign income Amount in foreign currency; Tax paid in foreign state Amount in foreign currency; Currency Rate'`

    example:
      `'US; 2022-03-10; USD; IBM; 3.28; 0.49; 0.908',`

1 You need a web browser with "Inspect element" tools and a "Console" tab.
2 login to eds system.
3 Open "Annual income declaration" -> "Open"
4 "Create"
5 "In Detail"
6 Mark D2 (D2 - Income earned by a natural person (resident) abroad)
7 Select the D2 tab
8 Open in your browser the "Inspect element" tool and "Console" tab
9 Copy fillEdsVidGovD2Form function from eds.js
  `const fillEdsVidGovD2Form = (data) => {
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
  }`
10 in "Console" put your income dividends data with maximum of 100 positions, for example:
  `const data = [
      'DE; 2022-05-09; EUR; BMW; 10.0; 2.0',
      'DE; 2022-05-09; EUR; BMW; 10.0; 2.0',
      'DE; 2022-05-09; EUR; BMW1; 11.0; 2.1',
      'US; 2022-03-10; USD; IBM; 3.28; 0.49; 0.908',
      'US; 2022-03-10; USD; IBM1; 3.28; 0.49; 0.908',
      'US; 2022-03-10; USD; IBM2; 3.28; 0.49; 0.908',
      'US; 2022-03-10; USD; IBM3; 3.28; 0.49; 0.908',
  ]`
  As you can see you can combine EU dividends and non-EU dividends.
11 Now need to call fillEdsVidGovD2Form() in Console:
  `fillEdsVidGovD2Form(data)`
  after this, you can see how a form is filled
  11.1 If you have more than 100 positions, you should do the same as 10 points but with different const, for example, `const data2 = [....]`
  11.2 open the second page of the form
  11.3 call the 11 point `fillEdsVidGovD2Form(data2)`
  11.4 you can see how a form is filled the second page
12 !!! CHECK EVERY POSITION IN YOUR D2 FORM !!!
13 Send the result to eds.

That's it :)
