import express from 'express';
import mime from 'mime-types';

const player = express.Router();
export default class WiredPlayer {
  playerRouter() {
    player.get('/:id', (req, res) => {
      const id = req.params.id;
      const file = this.findFile(id);
      if (this.fileCount() < 1 || (file && !this.fileExists(id))) {
        if (file) this.fileTable.splice([this.findIndex(file)], 1);
        const title = this.fileCount() < 1 ? 'no files found.' : 'file no longer exists.';
        const message =
          this.fileCount() < 1
            ? 'No files exist in the file table, please specify a valid directory in the server configuration.'
            : 'This file was removed from the server.';
        return res.status(500).render('player', {
          error: true,
          error_title: title,
          error_message: message
        });
      }
      if (!file) return this.randomFile(res);
      if (req.url.endsWith('/')) return res.redirect('/' + this.playerUrl + '/' + id);
      res.render('player', {
        title: this.cleanName(file),
        file_name: this.cleanName(file),
        file_id: this.findIndex(file),
        file_count: this.fileCount(),
        file_mime: mime.lookup(this.filePath + file),
        file_hash: this.genHash(file),
        url: req.get('host'),
        api_url: this.apiUrl,
        player_url: this.playerUrl
      });
    });
    player.get('/', (req, res) => {
      this.randomFile(res);
    });
    return player;
  }
}
