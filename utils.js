const isValidMovieBody = (newMovie) => Boolean(newMovie.name && newMovie.gender && newMovie.year);

module.exports = {
  isValidMovieBody,
};
