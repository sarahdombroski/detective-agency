// Route handlers for static pages
export const homePage = (req, res) => {
  res.render('home', { title: 'Home' });
};

// export const casesPage = (req, res) => {
//  res.render('cases', { title: 'Cases' });
// };

// export const investigationsPage = (req, res) => {
//   res.render('investigations', { title: 'My Investigations' });
// };