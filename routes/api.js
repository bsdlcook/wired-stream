import fs from 'fs';
import express from 'express';
import mime from 'mime-types';

const api = express.Router();
export default class WiredApi {
  apiRouter() {
    api.get('/:id', (req, res) => {
      const id = req.params.id;
      if (!this.findFile(id) || !this.fileExists(id)) return res.redirect('/');
      const client = req.ip.split(':').pop();
      const fileName = this.findFile(id);
      const filePath = this.filePath + fileName;
      const fileStat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': mime.lookup(filePath),
        'Content-Length': fileStat.size
      });
      console.log(
        "[%s]: Streaming file_id %s '%s' to client %s.",
        this.appName,
        this.findIndex(fileName),
        this.cleanName(fileName),
        client
      );
      fs.createReadStream(filePath).pipe(res);
    });
    api.get('/:id/info', (req, res) => {
      const id = req.params.id;
      if (!this.findFile(id)) return this.randomFile(res);
      const fileName = this.findFile(id);
      const fileId = this.findIndex(fileName);
      const fileHash = this.genHash(fileName);
      res.send({
        id: fileId,
        file: this.cleanName(fileName),
        hash: fileHash
      });
    });
    return api;
  }
}
