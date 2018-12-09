import fs from 'fs';
import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import minifyHTML from 'express-minify-html';
import crypto from 'crypto';
import mime from 'mime-types';
import classes from 'extends-classes';
import WiredApi from './routes/api';
import WiredPlayer from './routes/player';
import WiredIndex from './routes/index';
import {version} from './package';
import {getEnv} from './config/settings';

const app = express();
export default class WiredStream extends classes(WiredApi, WiredPlayer, WiredIndex) {
  constructor(options) {
    super();
    this.fileTable = [0];
    this.appName = `${this.constructor.name}@${getEnv().tag}-${version}`;
    this.hashLen = options.hashLen || 10;
    this.playerUrl = options.playerUrl || 'play';
    this.apiUrl = options.apiUrl || 'media';
    this.filePath = options.localDir;
    this.port = options.port || getEnv().port;
    this.allowedTypes = options.types;
    this.initFiles();
    this.initApp();
    this.start();
  }

  initFiles() {
    const files = fs.readdirSync(this.filePath);
    console.log('[%s] Looking for files in %s.', this.appName, this.filePath);
    files.forEach(file => {
      if (this.allowedTypes.indexOf(path.extname(file)) > -1)
        this.fileTable.push([file, this.genHash(file)]);
    });
    if (this.fileCount() < 1) {
      console.log('[%s] No files found in %s.', this.appName, this.filePath);
    } else {
      console.log(
        '[%s] Added %s files to the file table.',
        this.appName,
        this.fileCount()
      );
    }
  }

  initApp() {
    app.enable('trust proxy', true);
    app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
    app.set('view engine', 'hbs');
    if (getEnv().tag === 'prod') {
      app.use(
        minifyHTML({
          override: true,
          exception_url: false,
          htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true
          }
        })
      );
    }
    app.use('/' + this.apiUrl, this.apiRouter());
    app.use('/static', express.static('public'));
    app.use('/' + this.playerUrl, this.playerRouter());
    app.use('/', this.indexRouter());
    app.use((req, res) => {
      res.redirect('/');
    });
  }

  start() {
    app.listen(this.port, () => {
      console.log('[%s] Application running on port %s.', this.appName, this.port);
    });
  }

  cleanName(file) {
    return file.substring(0, file.length - path.extname(file).length);
  }

  fileCount() {
    return this.fileTable.length - 1;
  }

  genHash(file) {
    return crypto
      .createHash('sha1')
      .update(file)
      .digest('hex')
      .substr(0, this.hashLen);
  }

  fileExists(file) {
    return fs.existsSync(this.filePath + this.findFile(file));
  }

  findByHash(hash) {
    for (let i = 1; i <= this.fileCount(); i++)
      if (this.fileTable[i][1] === hash) return this.fileTable[i][0];
  }

  findById(id) {
    return this.fileTable[id] != null ? this.fileTable[id] : false;
  }

  findFile(id) {
    return this.findById(id) ? this.findById(id)[0] : this.findByHash(id);
  }

  findIndex(file) {
    for (let i = 1; i <= this.fileCount(); i++)
      if (this.fileTable[i][0] === file) return i;
  }

  randomFile(res) {
    res.redirect(
      '/' + this.playerUrl + '/' + Math.floor(Math.random() * this.fileCount() + 1)
    );
  }
}
