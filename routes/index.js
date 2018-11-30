import express from 'express';

const index = express.Router();
export default class WiredIndex {
  indexRouter() {
    index.get('/', (req, res) => {
      res.render('home', {
        layout: 'main',
        title: 'Uh oh — wired.sh',
      });
    });
    return index;
  }
}
