const isValidBody = (newMovie) => Boolean(newMovie.name && newMovie.gender && newMovie.year);

module.exports = {
  isValidBody,
};
