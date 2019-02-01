import express from 'express';

const index = express.Router();
export default class WiredIndex {
  indexRouter() {
    index.get('/', (req, res) => {
      res.render('home', {
        title: 'WiredStream.',
        version: this.appName
      });
    });
    return index;
  }
}
