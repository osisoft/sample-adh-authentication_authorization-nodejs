var appsettings = fetch('./appsettings.json').then((response) =>
  response.json()
);

export default await appsettings;
