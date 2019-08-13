// Select countries

const SouthAmerica = [
  'Ecuador',
  'Colombia',
  'Paraguay',
  'Uruguay',
  'Guyana',
  'Venezuela, RB',
  'Peru',
  'Panama',
  'Cuba'
];

const NorthAmerica = [
  'Mexico',
  'United States',
  'Greenland',
  'Iceland'
]

const Europe = [
  'Norway',
  'Greece',
  'Serbia',
  'Croatia',
  'Spain',
  'Portugal',
  'Germany',
  'Italy',
  'Ukraine',
  'Denmark',
  'Romania'
]

const Africa = [
  'Chad',
  'Nigeria',
  'Namibia',
  'Zambia',
  'South Sudan',
  'Somalia',
  'Uganda',
  'Kenya',
  'Malawi',
  'Comoros',
  'Madagascar',
  'Ethiopia',
  'Yemen, Rep.',
  'Sudan'
];

const Asia = [
  'Pakistan',
  'India',
  'Nepal',
  'Kazakhstan',
  'Maldives',
  'Sri Lanka',
  'Mongolia',
  'Thailand',
  'Lao PDR',
  'Cambodia',
  'Vietnam',
  'Singapore',
  'Indonesia'
]

const Rest = [
  'New Caledonia',
  'New Zealand',
  'Tonga',
  'Fiji',
  'Nauru',
  'Solomon Islands',
  'Kiribati',
  'Tuvalu'
]

const selected = [
  ...Asia,
  ...Africa,
  ...Europe,
  ...NorthAmerica,
  ...SouthAmerica,
  ...Rest
]


function selectCountries(list, countries) {
  return list.map(name => {
    const country = countries.find(c => c.name === name);
    const {latitude, longitude} = country;
    return {name, latitude, longitude};
  })
}




// Connections

const connections = {
  'Colombia': ['Ecuador', 'Cuba', 'Mexico', 'Peru', 'Venezuela, RB', 'Guyana', 'United States'],
  'South Sudan': ['Nigeria', 'Sudan', 'Kenya', 'Uganda', 'Zambia', 'Malawi', 'Ethiopia', 'Somalia', 'Madagascar', 'Yemen, Rep.'],
  'India': ['Pakistan', 'Kazakhstan', 'Maldives', 'Sri Lanka', 'Vietnam', 'Thailand'],
  'Thailand': ['Singapore', 'Indonesia', 'Nepal', 'Vietnam', 'Sri Lanka', 'Cambodia', 'Pakistan'],
  'Panama': ['Cuba', 'Mexico', 'Ecuador', 'Colombia', 'Peru', 'Venezuela, RB', 'United States'],
  'Fiji': ['Tuvalu', 'Nauru', 'Kiribati', 'Tonga', 'New Caledonia', 'New Zealand']
}


function getCountry(name, countries) {
  return countries.find(c => c.name === name);
}

function getCountries(object, countries) {
  return Object.keys(object).reduce((r, e) => {
    r[e] = object[e].map(c => getCountry(c, countries))
    return r;
  }, {})
}


